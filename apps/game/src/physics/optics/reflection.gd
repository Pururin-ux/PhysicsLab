class_name OpticsReflection
extends RefCounted

const EPSILON := 1.0e-8


static func reflect_direction(direction: Vector2, normal: Vector2) -> Vector2:
	if direction.length_squared() <= EPSILON or normal.length_squared() <= EPSILON:
		return Vector2.ZERO

	var incoming := direction.normalized()
	var surface_normal := normal.normalized()
	return (incoming - 2.0 * incoming.dot(surface_normal) * surface_normal).normalized()


static func ray_segment_intersection(
	origin: Vector2,
	direction: Vector2,
	segment_a: Vector2,
	segment_b: Vector2
) -> Dictionary:
	if direction.length_squared() <= EPSILON:
		return {"hit": false}

	var ray_direction := direction.normalized()
	var segment := segment_b - segment_a
	var denominator := _cross(ray_direction, segment)
	if absf(denominator) <= EPSILON:
		return {"hit": false}

	var offset := segment_a - origin
	var ray_distance := _cross(offset, segment) / denominator
	var segment_fraction := _cross(offset, ray_direction) / denominator
	if ray_distance < -EPSILON or segment_fraction < -EPSILON or segment_fraction > 1.0 + EPSILON:
		return {"hit": false}

	return {
		"hit": true,
		"point": origin + ray_direction * maxf(ray_distance, 0.0),
		"ray_distance": maxf(ray_distance, 0.0),
		"segment_fraction": clampf(segment_fraction, 0.0, 1.0),
	}


static func trace_plane_mirror_to_vertical_target(
	source: Vector2,
	incident_direction: Vector2,
	mirror_center: Vector2,
	mirror_tangent_angle: float,
	mirror_half_length: float,
	target_x: float,
	target_y_min: float,
	target_y_max: float
) -> Dictionary:
	var tangent := Vector2.RIGHT.rotated(mirror_tangent_angle)
	var mirror_a := mirror_center - tangent * mirror_half_length
	var mirror_b := mirror_center + tangent * mirror_half_length
	var intersection := ray_segment_intersection(source, incident_direction, mirror_a, mirror_b)
	if not intersection.get("hit", false):
		return {
			"mirror_hit": false,
			"mirror_a": mirror_a,
			"mirror_b": mirror_b,
		}

	var hit_point: Vector2 = intersection["point"]
	var normal := tangent.orthogonal().normalized()
	var reflected := reflect_direction(incident_direction, normal)
	var horizontal_distance := target_x - hit_point.x
	if absf(reflected.x) <= EPSILON:
		return {
			"mirror_hit": true,
			"target_hit": false,
			"hit_point": hit_point,
			"reflected_direction": reflected,
			"normal": normal,
			"mirror_a": mirror_a,
			"mirror_b": mirror_b,
		}

	var target_distance := horizontal_distance / reflected.x
	if target_distance <= EPSILON:
		return {
			"mirror_hit": true,
			"target_hit": false,
			"hit_point": hit_point,
			"reflected_direction": reflected,
			"normal": normal,
			"mirror_a": mirror_a,
			"mirror_b": mirror_b,
		}

	var target_point := hit_point + reflected * target_distance
	var target_hit := target_point.y >= target_y_min - EPSILON and target_point.y <= target_y_max + EPSILON
	return {
		"mirror_hit": true,
		"target_hit": target_hit,
		"hit_point": hit_point,
		"target_point": target_point,
		"reflected_direction": reflected,
		"normal": normal,
		"mirror_a": mirror_a,
		"mirror_b": mirror_b,
	}


static func _cross(a: Vector2, b: Vector2) -> float:
	return a.x * b.y - a.y * b.x

