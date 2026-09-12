extends SceneTree

var _checks := 0
var _failures := 0


func _init() -> void:
	call_deferred("_run")


func _run() -> void:
	var scene: PackedScene = load("res://src/main.tscn")
	var room = scene.instantiate()
	root.add_child(room)
	await process_frame

	_assert_equal(room.room_state, 0, "room starts in Explore")
	var opening_trace: Dictionary = room._trace_for_angle(room.mirror_angle)
	_assert_true(opening_trace.get("target_hit", false), "opening beam reaches the target wall")
	_assert_true(absf(opening_trace["target_point"].y - room.RECEIVER_CENTER.y) > room.RECEIVER_TOLERANCE, "opening beam visibly misses the receiver")

	room.dragging_mirror = true
	room._mirror_start_angle = room.mirror_angle
	room.mirror_angle = deg_to_rad(-8.0)
	room._recalculate_preview()
	room._pointer_released()
	_assert_equal(room.room_state, 1, "releasing an intentional mirror turn enters Forecast without a timer delay")

	var exact_trace: Dictionary = room._trace_for_angle(room.mirror_angle)
	_assert_true(exact_trace.get("target_hit", false), "aligned mirror reaches target wall")
	_assert_true(absf(exact_trace["target_point"].y - room.RECEIVER_CENTER.y) <= room.RECEIVER_TOLERANCE, "aligned mirror reaches the receiver")
	room.forecast_angle = exact_trace["reflected_direction"].angle()
	room._primary_action()
	_assert_equal(room.room_state, 2, "pinning starts Cascade")
	_assert_near(room.forecast_error, 0.0, 1.0e-5, "exact forecast has zero error")
	_assert_true(room._settle_success, "exact forecast creates a stable route")
	var bridge_scale_before: Vector2 = room._bridge.scale
	room._process(5.0)
	_assert_equal(room.room_state, 3, "cascade settles after its duration")
	_assert_near(room._bridge_root.rotation, room.BRIDGE_OPEN_ANGLE, 1.0e-5, "folding stair ends at its authored open angle")
	_assert_near(room._bridge.scale.x, bridge_scale_before.x, 1.0e-6, "bridge width never scales during deployment")
	_assert_near(room._bridge.scale.y, bridge_scale_before.y, 1.0e-6, "bridge height never scales during deployment")
	_assert_near(room._shorok_root.position.x, room.SHOROK_SAFE_X, 1.0e-5, "Shorok reaches the left landing")
	_assert_near(room._shorok_root.position.y, room._shorok_ground_y(room.SHOROK_SAFE_X), 1.0e-5, "Shorok's ground socket follows the painted stair surface")

	room._reset_attempt()
	room.mirror_angle = deg_to_rad(-8.0)
	room._recalculate_preview()
	room._primary_action()
	exact_trace = room._trace_for_angle(room.mirror_angle)
	room.forecast_angle = exact_trace["reflected_direction"].angle() + deg_to_rad(15.0)
	room._primary_action()
	_assert_true(not room._settle_success, "large forecast error breaks the route")
	_assert_true(room.echo_stability < 0.5, "large error produces visibly weak echo geometry")
	_assert_true(room.receiver_error <= room.RECEIVER_TOLERANCE, "receiver activation and forecast accuracy remain separate causes")

	var start_trace: Dictionary = room._trace_for_angle(deg_to_rad(-15.0))
	var finish_trace: Dictionary = room._trace_for_angle(deg_to_rad(-8.0))
	var mirror_turn := 7.0
	var beam_turn := absf(rad_to_deg(angle_difference(start_trace["reflected_direction"].angle(), finish_trace["reflected_direction"].angle())))
	_assert_near(beam_turn, mirror_turn * 2.0, 1.0e-5, "turning a plane mirror rotates the reflected ray by twice the angle")

	room.queue_free()
	if _failures == 0:
		print("PASS: %d room-flow checks" % _checks)
	else:
		push_error("FAIL: %d of %d room-flow checks" % [_failures, _checks])
	quit(_failures)


func _assert_true(value: bool, label: String) -> void:
	_checks += 1
	if not value:
		_failures += 1
		push_error(label)


func _assert_equal(actual: Variant, expected: Variant, label: String) -> void:
	_checks += 1
	if actual != expected:
		_failures += 1
		push_error("%s: expected %s, got %s" % [label, expected, actual])


func _assert_near(actual: float, expected: float, tolerance: float, label: String) -> void:
	_checks += 1
	if absf(actual - expected) > tolerance:
		_failures += 1
		push_error("%s: expected %.6f, got %.6f" % [label, expected, actual])
