extends SceneTree

const FPS := 30
const DURATION_SECONDS := 8.8
const FRAME_DIR := "res://art/reviews/living-bg-demo-frames-v1"


func _init() -> void:
	call_deferred("_capture_demo")


func _capture_demo() -> void:
	var scene: PackedScene = load("res://src/main.tscn")
	var room = scene.instantiate()
	root.add_child(room)
	Engine.max_fps = FPS
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(FRAME_DIR))
	# Let imported textures and the first viewport render settle so the exported
	# loop never begins on a black frame.
	for warmup_index in range(8):
		await process_frame

	for frame_index in range(int(DURATION_SECONDS * FPS)):
		var time := float(frame_index) / FPS
		_drive_demo(room, time)
		await process_frame
		if frame_index % 2 == 0:
			_save_frame(frame_index / 2)

	room.queue_free()
	quit(0)


func _drive_demo(room, time: float) -> void:
	# Show one complete first-time loop while the production background keeps
	# running naturally: inspect, turn, predict, observe, rescue.
	if time >= 0.8 and time < 2.15 and room.room_state == room.RoomState.EXPLORE:
		var turn_progress := smoothstep(0.0, 1.0, (time - 0.8) / 1.35)
		room.mirror_angle = deg_to_rad(lerpf(-15.0, -8.0, turn_progress))
		room._recalculate_preview()
	elif time >= 2.15 and room.room_state == room.RoomState.EXPLORE:
		room._enter_forecast()

	if time >= 2.15 and time < 3.75 and room.room_state == room.RoomState.FORECAST:
		var trace: Dictionary = room._trace_for_angle(room.mirror_angle)
		var target_angle: float = trace["reflected_direction"].angle()
		var starting_angle := target_angle + deg_to_rad(18.0)
		var prediction_progress := smoothstep(0.0, 1.0, (time - 2.15) / 1.6)
		room.forecast_angle = lerp_angle(starting_angle, target_angle, prediction_progress)
	elif time >= 3.75 and room.room_state == room.RoomState.FORECAST:
		var final_trace: Dictionary = room._trace_for_angle(room.mirror_angle)
		room.forecast_angle = final_trace["reflected_direction"].angle()
		room._start_cascade()


func _save_frame(index: int) -> void:
	var image := root.get_viewport().get_texture().get_image()
	var path := "%s/frame-%03d.png" % [FRAME_DIR, index]
	var error := image.save_png(path)
	if error != OK:
		push_error("Could not save %s: %s" % [path, error_string(error)])
