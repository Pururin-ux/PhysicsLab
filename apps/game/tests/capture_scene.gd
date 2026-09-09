extends SceneTree


func _init() -> void:
	call_deferred("_capture")


func _capture() -> void:
	var scene: PackedScene = load("res://src/main.tscn")
	var room = scene.instantiate()
	root.add_child(room)
	for index in range(10):
		await process_frame
	_save_viewport("res://art/reviews/autumn-ftue-explore-v1.png")

	room._explore_idle = 3.0
	room._refresh_visual_state()
	await process_frame
	await process_frame
	_save_viewport("res://art/reviews/autumn-ftue-hint-v1.png")

	room.mirror_angle = deg_to_rad(-8.0)
	room._recalculate_preview()
	room._primary_action()
	await process_frame
	await process_frame
	_save_viewport("res://art/reviews/autumn-ftue-forecast-v1.png")

	var trace: Dictionary = room._trace_for_angle(room.mirror_angle)
	room.forecast_angle = trace["reflected_direction"].angle()
	room._primary_action()
	room._process(2.80)
	await process_frame
	await process_frame
	_save_viewport("res://art/reviews/autumn-ftue-success-v1.png")

	room.queue_free()
	quit(0)


func _save_viewport(path: String) -> void:
	var image := root.get_viewport().get_texture().get_image()
	var error := image.save_png(path)
	if error != OK:
		push_error("Could not save %s: %s" % [path, error_string(error)])
	else:
		print("Saved %s (%dx%d)" % [path, image.get_width(), image.get_height()])
