extends SceneTree

const Reflection := preload("res://src/physics/optics/reflection.gd")

var _checks := 0
var _failures := 0


func _init() -> void:
	_run_reflection_tests()
	if _failures == 0:
		print("PASS: %d optics checks" % _checks)
	else:
		push_error("FAIL: %d of %d optics checks" % [_failures, _checks])
	quit(_failures)


func _run_reflection_tests() -> void:
	_assert_vector_close(
		Reflection.reflect_direction(Vector2.RIGHT, Vector2.LEFT),
		Vector2.LEFT,
		1.0e-7,
		"normal incidence reverses the ray"
	)

	var incoming := Vector2.RIGHT.rotated(deg_to_rad(37.0))
	var normal := Vector2.UP.rotated(deg_to_rad(13.0))
	var reflected := Reflection.reflect_direction(incoming, normal)
	var incidence_angle := acos(clampf(absf((-incoming.normalized()).dot(normal.normalized())), -1.0, 1.0))
	var reflection_angle := acos(clampf(absf(reflected.dot(normal.normalized())), -1.0, 1.0))
	_assert_near(incidence_angle, reflection_angle, 1.0e-7, "angle of incidence equals angle of reflection")
	_assert_near(reflected.length(), 1.0, 1.0e-7, "reflected direction is normalized")

	var tangent_angle_a := deg_to_rad(11.0)
	var tangent_angle_b := tangent_angle_a + deg_to_rad(7.0)
	var reflected_a := Reflection.reflect_direction(incoming, Vector2.RIGHT.rotated(tangent_angle_a).orthogonal())
	var reflected_b := Reflection.reflect_direction(incoming, Vector2.RIGHT.rotated(tangent_angle_b).orthogonal())
	var reflected_rotation := wrapf(reflected_b.angle() - reflected_a.angle(), -PI, PI)
	_assert_near(reflected_rotation, deg_to_rad(14.0), 1.0e-7, "rotating a plane mirror by alpha rotates the reflected ray by 2 alpha")

	_assert_vector_close(
		Reflection.reflect_direction(Vector2.ZERO, Vector2.UP),
		Vector2.ZERO,
		0.0,
		"zero incoming direction is rejected"
	)
	_assert_vector_close(
		Reflection.reflect_direction(Vector2.RIGHT, Vector2.ZERO),
		Vector2.ZERO,
		0.0,
		"zero normal is rejected"
	)

	var crossing := Reflection.ray_segment_intersection(
		Vector2.ZERO,
		Vector2.RIGHT,
		Vector2(4.0, -2.0),
		Vector2(4.0, 2.0)
	)
	_assert_true(crossing.get("hit", false), "ray intersects a vertical segment")
	_assert_vector_close(crossing.get("point", Vector2.ZERO), Vector2(4.0, 0.0), 1.0e-7, "intersection point is exact")

	var behind := Reflection.ray_segment_intersection(
		Vector2.ZERO,
		Vector2.RIGHT,
		Vector2(-4.0, -2.0),
		Vector2(-4.0, 2.0)
	)
	_assert_true(not behind.get("hit", false), "segment behind the ray is ignored")

	var parallel := Reflection.ray_segment_intersection(
		Vector2.ZERO,
		Vector2.RIGHT,
		Vector2(2.0, 1.0),
		Vector2(6.0, 1.0)
	)
	_assert_true(not parallel.get("hit", false), "parallel ray and segment do not produce a false hit")

	var source := Vector2(70.0, 180.0)
	var center := Vector2(195.0, 405.0)
	var incident_direction := (center - source).normalized()
	var trace := Reflection.trace_plane_mirror_to_vertical_target(
		source,
		incident_direction,
		center,
		deg_to_rad(16.0),
		52.0,
		350.0,
		170.0,
		560.0
	)
	_assert_true(trace.get("mirror_hit", false), "room ray reaches the mirror")
	_assert_true(trace.get("target_hit", false), "room ray reaches the target wall")
	_assert_near(trace.get("target_point", Vector2.ZERO).x, 350.0, 1.0e-6, "target trace lands on the declared wall")


func _assert_true(value: bool, label: String) -> void:
	_checks += 1
	if not value:
		_failures += 1
		push_error(label)


func _assert_near(actual: float, expected: float, tolerance: float, label: String) -> void:
	_checks += 1
	if absf(actual - expected) > tolerance:
		_failures += 1
		push_error("%s: expected %.9f, got %.9f" % [label, expected, actual])


func _assert_vector_close(actual: Vector2, expected: Vector2, tolerance: float, label: String) -> void:
	_checks += 1
	if actual.distance_to(expected) > tolerance:
		_failures += 1
		push_error("%s: expected %s, got %s" % [label, expected, actual])

