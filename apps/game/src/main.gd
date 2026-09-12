extends Node2D

const Reflection := preload("res://src/physics/optics/reflection.gd")
const LivingBackground := preload("res://src/visuals/living_autumn_background.gd")

const UI_FONT := preload("res://art/fonts/Commissioner-Variable.ttf")
const NERI_TEXTURE := preload("res://art/characters/neri-idle-v1.png")
const SHOROK_TEXTURE := preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-00.png")
const SHOROK_WALK_TEXTURES := [
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-00.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-01.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-02.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-03.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-04.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-05.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-06.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-07.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-08.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-09.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-10.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-11.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-12.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-13.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-14.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-15.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-16.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-17.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-18.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-19.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-20.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-21.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-22.png"),
	preload("res://art/characters/shorok-walk-runtime-v1/shorok-walk-23.png"),
]
const EMITTER_TEXTURE := preload("res://art/props/light-emitter-game-v1.png")
const MIRROR_PEDESTAL_TEXTURE := preload("res://art/props/mirror-pedestal-game-v1.png")
const MIRROR_ROTOR_TEXTURE := preload("res://art/props/mirror-rotor-game-v1.png")
const RECEIVER_OFF_TEXTURE := preload("res://art/props/light-receiver-off-game-v1.png")
const RECEIVER_ON_TEXTURE := preload("res://art/props/light-receiver-on-game-v1.png")
const BRIDGE_TEXTURE := preload("res://art/props/folding-stair-frame-game-v2.png")

enum RoomState {
	EXPLORE,
	FORECAST,
	CASCADE,
	SETTLE,
}

const VIEW_SIZE := Vector2(390.0, 844.0)
const MIRROR_CENTER := Vector2(145.0, 405.0)
const MIRROR_HALF_LENGTH := 38.0
const RECEIVER_CENTER := Vector2(333.0, 294.0)
const TARGET_X := RECEIVER_CENTER.x
const TARGET_Y_MIN := 214.0
const TARGET_Y_MAX := 520.0
const MIRROR_MIN_ANGLE := -28.0
const MIRROR_MAX_ANGLE := 10.0
const FORECAST_MIN_ANGLE := deg_to_rad(-78.0)
const FORECAST_MAX_ANGLE := deg_to_rad(24.0)
const FORECAST_TOLERANCE_DEGREES := 4.0
const RECEIVER_TOLERANCE := 18.0
const MAX_ECHO_ERROR_DEGREES := 24.0
const BEAM_REVEAL_DURATION := 0.36
const BRIDGE_OPEN_DELAY := 0.46
const BRIDGE_OPEN_DURATION := 0.92
const CROSSING_DELAY := 1.62
const CROSSING_DURATION := 3.30
const CASCADE_DURATION := 4.75
const BRIDGE_HINGE_WORLD := Vector2(220.0, 490.0)
const BRIDGE_HINGE_PIXEL := Vector2(1698.0, 718.0)
const BRIDGE_RENDER_WIDTH := 118.0
const BRIDGE_CLOSED_ANGLE := deg_to_rad(-91.0)
const BRIDGE_OPEN_ANGLE := 0.0
const BRIDGE_LEFT_X := 110.0
const BRIDGE_LEFT_Y := 448.0
const SHOROK_START_X := 270.0
# The first shot stops Shorok beside the apparatus, still visibly supported by
# the open stair. Completing the last two steps is reserved for the dialogue
# beat so the character never disappears behind the mirror sprite.
const SHOROK_SAFE_X := 174.0
const SHOROK_RENDER_WIDTH := 76.0
const SHOROK_SOURCE_VISIBLE_WIDTH := 468.62
const SHOROK_GAIT_DISTANCE := 11.42

const PRIMARY_RECT := Rect2(105.0, 760.0, 180.0, 58.0)
const FOX_RECT := Rect2()

var room_state := RoomState.EXPLORE
var source := Vector2(105.0, 395.0)
var mirror_angle := deg_to_rad(-15.0)
var forecast_angle := deg_to_rad(-18.0)
var committed_angle := deg_to_rad(-18.0)
var dragging_mirror := false
var dragging_forecast := false
var cascade_elapsed := 0.0
var cascade_trace: Dictionary = {}
var forecast_error := INF
var receiver_error := INF
var echo_stability := 0.0
var run_progress := 0.0
var challenge_index := 0
var ambient_time := 0.0

var _settle_success := false
var _explore_idle := 0.0
var _has_rotated_mirror := false
var _mirror_start_angle := 0.0
var _attempt_start_angle := deg_to_rad(-15.0)

var _background: LivingAutumnBackground
var _neri: Sprite2D
var _shorok_root: Node2D
var _shorok: Sprite2D
var _shorok_walk: AnimatedSprite2D
var _emitter: Sprite2D
var _mirror_pedestal: Sprite2D
var _mirror_rotor: Sprite2D
var _mirror_base_scale := Vector2.ONE
var _receiver_off: Sprite2D
var _receiver_on: Sprite2D
var _bridge_root: Node2D
var _bridge: Sprite2D
var _instruction: Label
var _insight: Label
var _button: Button
var _ui_font: FontVariation


func _ready() -> void:
	_build_scene()
	_recalculate_preview()
	_refresh_visual_state()
	queue_redraw()


func _process(delta: float) -> void:
	ambient_time += delta
	if room_state == RoomState.EXPLORE:
		_explore_idle += delta
	elif room_state == RoomState.CASCADE:
		cascade_elapsed += delta
		if cascade_elapsed >= CROSSING_DELAY:
			run_progress = clampf((cascade_elapsed - CROSSING_DELAY) / CROSSING_DURATION, 0.0, 1.0) if _settle_success else 0.0
		if cascade_elapsed >= CASCADE_DURATION:
			room_state = RoomState.SETTLE

	_refresh_visual_state()
	queue_redraw()


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			_pointer_pressed(event.position)
		else:
			_pointer_released()
	elif event is InputEventScreenDrag:
		_pointer_dragged(event.position)
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			_pointer_pressed(event.position)
		else:
			_pointer_released()
	elif event is InputEventMouseMotion and Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		_pointer_dragged(event.position)


func _pointer_pressed(position: Vector2) -> void:
	if room_state == RoomState.EXPLORE and position.distance_to(MIRROR_CENTER) <= 78.0:
		dragging_mirror = true
		_mirror_start_angle = mirror_angle
		_update_mirror_angle(position)
	elif room_state == RoomState.FORECAST and position.x >= MIRROR_CENTER.x + 18.0 and position.y >= 132.0 and position.y <= 650.0:
		dragging_forecast = true
		_update_forecast_angle(position)
		queue_redraw()


func _pointer_dragged(position: Vector2) -> void:
	if dragging_mirror and room_state == RoomState.EXPLORE:
		_update_mirror_angle(position)
	elif dragging_forecast and room_state == RoomState.FORECAST:
		_update_forecast_angle(position)
		queue_redraw()


func _pointer_released() -> void:
	if dragging_mirror and room_state == RoomState.EXPLORE:
		_has_rotated_mirror = _has_rotated_mirror or absf(rad_to_deg(mirror_angle - _mirror_start_angle)) >= 1.5
		if _has_rotated_mirror:
			_enter_forecast()
	dragging_mirror = false
	dragging_forecast = false


func _primary_action() -> void:
	match room_state:
		RoomState.EXPLORE:
			_enter_forecast()
		RoomState.FORECAST:
			_start_cascade()
		RoomState.SETTLE:
			if _settle_success:
				challenge_index = (challenge_index + 1) % 3
				_apply_challenge()
			else:
				_reset_attempt()
	_refresh_visual_state()
	queue_redraw()


func _enter_forecast() -> void:
	room_state = RoomState.FORECAST
	var trace := _trace_for_angle(mirror_angle)
	if trace.get("mirror_hit", false):
		var reflected: Vector2 = trace["reflected_direction"]
		forecast_angle = clampf(reflected.angle() + deg_to_rad(18.0), FORECAST_MIN_ANGLE, FORECAST_MAX_ANGLE)
	_refresh_visual_state()


func _update_mirror_angle(position: Vector2) -> void:
	var requested := rad_to_deg((position - MIRROR_CENTER).angle())
	while requested > 90.0:
		requested -= 180.0
	while requested < -90.0:
		requested += 180.0
	mirror_angle = deg_to_rad(clampf(requested, MIRROR_MIN_ANGLE, MIRROR_MAX_ANGLE))
	_recalculate_preview()
	_refresh_visual_state()
	queue_redraw()


func _update_forecast_angle(position: Vector2) -> void:
	var trace := _trace_for_angle(mirror_angle)
	if not trace.get("mirror_hit", false):
		return
	var hit: Vector2 = trace["hit_point"]
	var direction := position - hit
	if direction.length_squared() <= 1.0:
		return
	forecast_angle = clampf(direction.angle(), FORECAST_MIN_ANGLE, FORECAST_MAX_ANGLE)


func _start_cascade() -> void:
	committed_angle = forecast_angle
	cascade_trace = _trace_for_angle(mirror_angle)
	cascade_elapsed = 0.0
	run_progress = 0.0
	forecast_error = INF
	receiver_error = INF
	echo_stability = 0.0
	_settle_success = false
	if cascade_trace.get("target_hit", false):
		var actual_y: float = cascade_trace["target_point"].y
		var actual_angle: float = cascade_trace["reflected_direction"].angle()
		forecast_error = absf(rad_to_deg(angle_difference(committed_angle, actual_angle)))
		receiver_error = absf(RECEIVER_CENTER.y - actual_y)
		echo_stability = clampf(1.0 - forecast_error / MAX_ECHO_ERROR_DEGREES, 0.0, 1.0)
		_settle_success = forecast_error <= FORECAST_TOLERANCE_DEGREES and receiver_error <= RECEIVER_TOLERANCE
	room_state = RoomState.CASCADE
	_refresh_visual_state()


func _reset_attempt() -> void:
	room_state = RoomState.EXPLORE
	cascade_elapsed = 0.0
	run_progress = 0.0
	forecast_error = INF
	receiver_error = INF
	echo_stability = 0.0
	_settle_success = false
	_explore_idle = 0.0
	_has_rotated_mirror = false
	_attempt_start_angle = mirror_angle
	_recalculate_preview()
	var trace := _trace_for_angle(mirror_angle)
	if trace.get("mirror_hit", false):
		forecast_angle = clampf(trace["reflected_direction"].angle() + deg_to_rad(18.0), FORECAST_MIN_ANGLE, FORECAST_MAX_ANGLE)
	_refresh_visual_state()
	queue_redraw()


func _apply_challenge() -> void:
	var sources := [
		Vector2(105.0, 395.0),
		Vector2(100.0, 405.0),
		Vector2(110.0, 388.0),
	]
	var angles := [-15.0, -18.0, -12.0]
	source = sources[challenge_index]
	mirror_angle = deg_to_rad(angles[challenge_index])
	_reset_attempt()


func _recalculate_preview() -> void:
	cascade_trace = _trace_for_angle(mirror_angle)


func _trace_for_angle(angle: float) -> Dictionary:
	return Reflection.trace_plane_mirror_to_vertical_target(
		source,
		(MIRROR_CENTER - source).normalized(),
		MIRROR_CENTER,
		angle,
		MIRROR_HALF_LENGTH,
		TARGET_X,
		TARGET_Y_MIN,
		TARGET_Y_MAX
	)


func _draw() -> void:
	_draw_beam()
	if room_state == RoomState.EXPLORE and _explore_idle >= 2.2 and not dragging_mirror:
		_draw_mirror_hint()
	if room_state == RoomState.FORECAST:
		_draw_forecast_ray(1.0)
	elif room_state == RoomState.CASCADE and cascade_elapsed <= 1.15:
		_draw_forecast_ray(1.0 - cascade_elapsed / 1.15)
	if (room_state == RoomState.CASCADE or room_state == RoomState.SETTLE) and _settle_success and cascade_elapsed >= 0.52:
		_draw_reflection_law()
	elif (room_state == RoomState.CASCADE or room_state == RoomState.SETTLE) and not _settle_success:
		_draw_miss_feedback()


func _draw_beam() -> void:
	var trace := cascade_trace if room_state == RoomState.CASCADE or room_state == RoomState.SETTLE else _trace_for_angle(mirror_angle)
	if not trace.get("mirror_hit", false):
		return
	var hit: Vector2 = trace["hit_point"]
	_draw_glowing_segment(source, hit, 1.0)

	var reflected: Vector2 = trace["reflected_direction"]
	if room_state == RoomState.EXPLORE or room_state == RoomState.FORECAST:
		# A short physical cue makes the interaction legible without revealing the
		# answer. The player must still extend the direction before observation.
		_draw_glowing_segment(hit, hit + reflected * 34.0, 0.78)
		return

	if not trace.has("target_point"):
		return
	var endpoint: Vector2 = trace["target_point"]
	var reveal := 1.0
	if room_state == RoomState.CASCADE:
		reveal = clampf(cascade_elapsed / BEAM_REVEAL_DURATION, 0.0, 1.0)
		reveal = smoothstep(0.0, 1.0, reveal)
	var visible_end := hit.lerp(endpoint, reveal)
	_draw_glowing_segment(hit, visible_end, reveal)


func _draw_glowing_segment(start: Vector2, end: Vector2, alpha: float) -> void:
	if alpha <= 0.0:
		return
	draw_line(start, end, Color(0.96, 0.57, 0.18, 0.10 * alpha), 11.0, true)
	draw_line(start, end, Color(1.0, 0.72, 0.30, 0.30 * alpha), 4.5, true)
	draw_line(start, end, Color(1.0, 0.93, 0.72, 0.95 * alpha), 1.45, true)


func _draw_forecast_ray(alpha: float) -> void:
	if alpha <= 0.0:
		return
	var trace := _trace_for_angle(mirror_angle)
	if not trace.get("mirror_hit", false):
		return
	var hit: Vector2 = trace["hit_point"]
	var endpoint := _forecast_endpoint(hit, forecast_angle)
	var direction := (endpoint - hit).normalized()
	var perpendicular := direction.orthogonal()
	var energy := 0.62 + (0.18 * sin(ambient_time * 4.2) if dragging_forecast else 0.0)
	draw_line(hit, endpoint, Color(0.46, 0.89, 0.83, 0.11 * alpha), 10.0, true)
	draw_dashed_line(hit, endpoint, Color(0.71, 1.0, 0.92, energy * alpha), 2.1, 8.0, true, true)
	# The arrow belongs to the predicted ray itself; there is no detached wall
	# marker with a separate hit target anymore.
	draw_line(endpoint, endpoint - direction * 13.0 + perpendicular * 6.0, Color(0.76, 1.0, 0.92, 0.86 * alpha), 2.1, true)
	draw_line(endpoint, endpoint - direction * 13.0 - perpendicular * 6.0, Color(0.76, 1.0, 0.92, 0.86 * alpha), 2.1, true)


func _forecast_endpoint(hit: Vector2, angle: float) -> Vector2:
	var direction := Vector2.RIGHT.rotated(angle)
	if direction.x <= 0.02:
		return hit + direction * 205.0
	return hit + direction * ((TARGET_X - hit.x) / direction.x)


func _draw_mirror_hint() -> void:
	var phase := fposmod(ambient_time * 0.42, 1.0) * TAU
	var breathe := sin(ambient_time * 2.8) * 1.4
	var hint_color := Color(1.0, 0.75, 0.34, 0.42)
	draw_arc(MIRROR_CENTER, 43.0 + breathe, phase, phase + 1.48, 24, hint_color, 2.0, true)
	draw_arc(MIRROR_CENTER, 43.0 + breathe, phase + PI, phase + PI + 1.48, 24, hint_color, 2.0, true)


func _draw_miss_feedback() -> void:
	if cascade_elapsed < BEAM_REVEAL_DURATION or not cascade_trace.has("target_point"):
		return
	var actual: Vector2 = cascade_trace["target_point"]
	if receiver_error > RECEIVER_TOLERANCE:
		var pulse := 1.0 + sin(ambient_time * 4.0) * 0.08
		draw_arc(RECEIVER_CENTER, 20.0 * pulse, -1.05, 1.05, 24, Color(0.96, 0.58, 0.24, 0.78), 2.0, true)
		draw_line(actual - Vector2(0.0, 7.0), actual + Vector2(0.0, 7.0), Color(1.0, 0.73, 0.38, 0.72), 2.0, true)
	elif forecast_error > FORECAST_TOLERANCE_DEGREES:
		var hit: Vector2 = cascade_trace["hit_point"]
		_draw_arc_between(hit, 28.0, committed_angle, cascade_trace["reflected_direction"].angle(), Color(0.76, 1.0, 0.92, 0.76), 2.1)


func _draw_reflection_law() -> void:
	if not cascade_trace.get("mirror_hit", false):
		return
	var hit: Vector2 = cascade_trace["hit_point"]
	var normal: Vector2 = cascade_trace["normal"]
	var to_source := (source - hit).normalized()
	if normal.dot(to_source) < 0.0:
		normal = -normal
	var reflected: Vector2 = cascade_trace["reflected_direction"]
	var fade := clampf((cascade_elapsed - 0.52) / 0.32, 0.0, 1.0)
	var color := Color(0.80, 0.96, 0.91, 0.78 * fade)
	draw_dashed_line(hit - normal * 39.0, hit + normal * 39.0, Color(0.80, 0.96, 0.91, 0.45 * fade), 1.3, 5.0, true, true)
	_draw_arc_between(hit, 23.0, to_source.angle(), normal.angle(), color, 1.8)
	_draw_arc_between(hit, 23.0, normal.angle(), reflected.angle(), color, 1.8)
	if is_instance_valid(_ui_font):
		var left_label := hit + Vector2.RIGHT.rotated(lerp_angle(to_source.angle(), normal.angle(), 0.5)) * 34.0
		var right_label := hit + Vector2.RIGHT.rotated(lerp_angle(normal.angle(), reflected.angle(), 0.5)) * 34.0
		draw_string(_ui_font, left_label, "α", HORIZONTAL_ALIGNMENT_CENTER, 14.0, 14, color)
		draw_string(_ui_font, right_label, "α", HORIZONTAL_ALIGNMENT_CENTER, 14.0, 14, color)


func _draw_arc_between(center: Vector2, radius: float, start_angle: float, end_angle: float, color: Color, width: float) -> void:
	var points := PackedVector2Array()
	var delta := angle_difference(start_angle, end_angle)
	for index in range(19):
		var fraction := float(index) / 18.0
		points.append(center + Vector2.RIGHT.rotated(start_angle + delta * fraction) * radius)
	draw_polyline(points, color, width, true)


func _build_scene() -> void:
	_background = LivingBackground.new()
	_background.name = "Living autumn world"
	add_child(_background)

	_emitter = _sprite_with_height(EMITTER_TEXTURE, Vector2(92.0, 413.0), 69.0, 1)
	_emitter.name = "Light emitter"
	add_child(_emitter)

	_mirror_pedestal = _sprite_with_height(MIRROR_PEDESTAL_TEXTURE, Vector2(145.0, 427.0), 68.0, 1)
	_mirror_pedestal.name = "Mirror pedestal"
	add_child(_mirror_pedestal)

	_mirror_rotor = _sprite_with_height(MIRROR_ROTOR_TEXTURE, MIRROR_CENTER, 62.0, 2)
	_mirror_rotor.name = "Rotating mirror"
	_mirror_base_scale = _mirror_rotor.scale
	add_child(_mirror_rotor)

	_receiver_off = _sprite_with_height(RECEIVER_OFF_TEXTURE, RECEIVER_CENTER, 72.0, 1)
	_receiver_off.name = "Dormant receiver"
	add_child(_receiver_off)
	_receiver_on = _sprite_with_height(RECEIVER_ON_TEXTURE, RECEIVER_CENTER, 72.0, 2)
	_receiver_on.name = "Lit receiver"
	add_child(_receiver_on)

	_bridge_root = Node2D.new()
	_bridge_root.name = "Counterweighted folding stair hinge"
	_bridge_root.position = BRIDGE_HINGE_WORLD
	_bridge_root.rotation = BRIDGE_CLOSED_ANGLE
	_bridge_root.z_index = 1
	add_child(_bridge_root)
	_bridge = Sprite2D.new()
	_bridge.name = "Rigid authored folding stair"
	_bridge.texture = BRIDGE_TEXTURE
	var bridge_scale := BRIDGE_RENDER_WIDTH / BRIDGE_TEXTURE.get_width()
	_bridge.scale = Vector2.ONE * bridge_scale
	var bridge_texture_center := Vector2(BRIDGE_TEXTURE.get_width(), BRIDGE_TEXTURE.get_height()) * 0.5
	_bridge.position = -(BRIDGE_HINGE_PIXEL - bridge_texture_center) * bridge_scale
	_bridge_root.add_child(_bridge)

	_neri = _sprite_with_height(NERI_TEXTURE, Vector2(42.0, 391.0), 121.0, 3)
	_neri.name = "Neri"
	add_child(_neri)

	_shorok_root = Node2D.new()
	_shorok_root.name = "Shorok ground socket"
	_shorok_root.position = Vector2(SHOROK_START_X, 490.0)
	_shorok_root.z_index = 3
	add_child(_shorok_root)

	_shorok = Sprite2D.new()
	_shorok.texture = SHOROK_TEXTURE
	_shorok.position = Vector2.ZERO
	_shorok.centered = true
	_shorok.offset = Vector2(0.0, 256.0 - 444.0)
	_shorok.scale = Vector2.ONE * (SHOROK_RENDER_WIDTH / SHOROK_SOURCE_VISIBLE_WIDTH)
	_shorok.name = "Shorok idle"
	_shorok_root.add_child(_shorok)

	var walk_frames := SpriteFrames.new()
	walk_frames.add_animation("walk")
	walk_frames.set_animation_loop("walk", true)
	walk_frames.set_animation_speed("walk", 24.0)
	for texture in SHOROK_WALK_TEXTURES:
		walk_frames.add_frame("walk", texture)
	_shorok_walk = AnimatedSprite2D.new()
	_shorok_walk.name = "Shorok authored walk cycle"
	_shorok_walk.sprite_frames = walk_frames
	_shorok_walk.animation = "walk"
	_shorok_walk.centered = true
	_shorok_walk.offset = Vector2(0.0, 256.0 - 444.0)
	_shorok_walk.scale = Vector2.ONE * (SHOROK_RENDER_WIDTH / SHOROK_SOURCE_VISIBLE_WIDTH)
	_shorok_walk.visible = false
	_shorok_root.add_child(_shorok_walk)
	_shorok_walk.play("walk")
	_shorok_walk.pause()

	_build_ui()


func _build_ui() -> void:
	var canvas := CanvasLayer.new()
	canvas.name = "Minimal onboarding UI"
	add_child(canvas)
	_ui_font = FontVariation.new()
	_ui_font.base_font = UI_FONT
	_ui_font.variation_opentype = {&"wght": 700.0}
	_ui_font.variation_embolden = 0.8

	_instruction = Label.new()
	_instruction.name = "Single instruction"
	_instruction.position = Vector2(24.0, 32.0)
	_instruction.size = Vector2(342.0, 46.0)
	_instruction.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_instruction.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_instruction.add_theme_font_override("font", _ui_font)
	_instruction.add_theme_font_size_override("font_size", 21)
	_instruction.add_theme_color_override("font_color", Color("fff8e8"))
	_instruction.add_theme_color_override("font_outline_color", Color(0.05, 0.035, 0.03, 0.88))
	_instruction.add_theme_constant_override("outline_size", 3)
	canvas.add_child(_instruction)

	_insight = Label.new()
	_insight.name = "Shorok diegetic observation"
	_insight.position = Vector2(39.0, 520.0)
	_insight.size = Vector2(312.0, 66.0)
	_insight.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	_insight.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	_insight.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_insight.add_theme_font_override("font", _ui_font)
	_insight.add_theme_font_size_override("font_size", 16)
	_insight.add_theme_color_override("font_color", Color("e8f5e9"))
	_insight.add_theme_color_override("font_outline_color", Color(0.04, 0.035, 0.03, 0.94))
	_insight.add_theme_constant_override("outline_size", 4)
	_insight.visible = false
	canvas.add_child(_insight)

	_button = Button.new()
	_button.name = "Only primary action"
	_button.position = PRIMARY_RECT.position
	_button.size = PRIMARY_RECT.size
	_button.add_theme_font_override("font", _ui_font)
	_button.add_theme_font_size_override("font_size", 18)
	_button.add_theme_color_override("font_color", Color("fff0cf"))
	_button.add_theme_color_override("font_hover_color", Color("fff3da"))
	_button.add_theme_color_override("font_pressed_color", Color("fff3da"))
	_button.add_theme_color_override("font_outline_color", Color(0.05, 0.035, 0.03, 0.92))
	_button.add_theme_constant_override("outline_size", 2)
	_button.add_theme_stylebox_override("normal", _button_style(Color("17120fee"), Color("d59a43"), 1))
	_button.add_theme_stylebox_override("hover", _button_style(Color("241a14f2"), Color("eab35f"), 2))
	_button.add_theme_stylebox_override("pressed", _button_style(Color("332219f5"), Color("ffc76f"), 2))
	_button.focus_mode = Control.FOCUS_NONE
	_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	_button.pressed.connect(_primary_action)
	canvas.add_child(_button)


func _button_style(fill: Color, border: Color, border_width: int) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = border
	style.set_border_width_all(border_width)
	style.set_corner_radius_all(29)
	style.content_margin_left = 18.0
	style.content_margin_right = 18.0
	return style


func _refresh_visual_state() -> void:
	if not is_instance_valid(_mirror_rotor):
		return
	_mirror_rotor.rotation = mirror_angle - PI * 0.5
	var mirror_hint_active := room_state == RoomState.EXPLORE and _explore_idle >= 2.2 and not dragging_mirror
	var mirror_breathe := 1.0 + (0.018 * (0.5 + 0.5 * sin(ambient_time * 2.8)) if mirror_hint_active else 0.0)
	_mirror_rotor.scale = _mirror_base_scale * mirror_breathe
	_mirror_rotor.modulate = Color(1.08, 1.02, 0.90, 1.0) if mirror_hint_active else Color.WHITE

	var receiver_activated := (room_state == RoomState.CASCADE or room_state == RoomState.SETTLE) and receiver_error <= RECEIVER_TOLERANCE and cascade_elapsed >= BEAM_REVEAL_DURATION
	_receiver_on.visible = receiver_activated
	_receiver_off.visible = not receiver_activated

	# The stair is a rigid mechanism that is already present in the world. It
	# rotates around its visible hinge; no scaling or materialization is used.
	var bridge_enabled := _settle_success and (room_state == RoomState.CASCADE or room_state == RoomState.SETTLE)
	var bridge_progress := clampf((cascade_elapsed - BRIDGE_OPEN_DELAY) / BRIDGE_OPEN_DURATION, 0.0, 1.0) if bridge_enabled else 0.0
	_bridge_root.rotation = lerp_angle(BRIDGE_CLOSED_ANGLE, BRIDGE_OPEN_ANGLE, _bridge_open_curve(bridge_progress))

	var crossing := clampf((cascade_elapsed - CROSSING_DELAY) / CROSSING_DURATION, 0.0, 1.0) if bridge_enabled else 0.0
	var crossing_eased := smoothstep(0.0, 1.0, crossing)
	_shorok_root.position.x = lerpf(SHOROK_START_X, SHOROK_SAFE_X, crossing_eased)
	_shorok_root.position.y = _shorok_ground_y(_shorok_root.position.x)
	var walking := bridge_enabled and crossing > 0.01 and crossing < 0.995
	_shorok.visible = not walking
	_shorok_walk.visible = walking
	if walking:
		# Foot phase follows travelled distance. Blender-rendered replacement clips
		# will use the same contract, so frame rate cannot create paw sliding.
		var travelled := absf(SHOROK_START_X - _shorok_root.position.x)
		var frame_distance := SHOROK_GAIT_DISTANCE / float(SHOROK_WALK_TEXTURES.size())
		_shorok_walk.frame = int(floor(travelled / frame_distance)) % SHOROK_WALK_TEXTURES.size()

	_insight.visible = false

	match room_state:
		RoomState.EXPLORE:
			_instruction.text = "Проведи пальцем по зеркалу" if _explore_idle >= 2.2 and not dragging_mirror else ""
			_button.visible = false
		RoomState.FORECAST:
			_instruction.text = "Потяни призрачный луч"
			_button.text = "ПУСТИТЬ СВЕТ"
			_button.visible = true
		RoomState.CASCADE:
			_instruction.text = ""
			_button.visible = false
			if _settle_success and cascade_elapsed >= 0.82:
				_insight.text = "Шорох: «Равные углы к нормали. Так держится отражение.»"
				_insight.visible = cascade_elapsed < 2.55
		RoomState.SETTLE:
			if _settle_success:
				_instruction.text = ""
				_insight.text = _turn_relation_text()
				_insight.visible = true
				_button.text = "ИДТИ ДАЛЬШЕ"
				_button.visible = true
			else:
				_instruction.text = "Свет не попал в замок" if receiver_error > RECEIVER_TOLERANCE else "Ты предсказал другое направление"
				_button.text = "ЕЩЁ РАЗ"
				_button.visible = true


func _shorok_ground_y(world_x: float) -> float:
	# The right and left endpoints come from the painted cliff tops. Between them
	# the socket follows the authored stair deck exactly, so paws cannot float.
	if world_x >= BRIDGE_HINGE_WORLD.x:
		return 490.0
	if world_x >= BRIDGE_LEFT_X:
		return lerpf(BRIDGE_LEFT_Y, BRIDGE_HINGE_WORLD.y, (world_x - BRIDGE_LEFT_X) / (BRIDGE_HINGE_WORLD.x - BRIDGE_LEFT_X))
	return BRIDGE_LEFT_Y


func _bridge_open_curve(progress: float) -> float:
	if progress <= 0.0:
		return 0.0
	if progress < 0.12:
		# A small counterweight pull precedes the release, making the mechanism
		# feel loaded rather than spawned by a UI event.
		return -0.035 * sin(PI * progress / 0.12)
	var released := (progress - 0.12) / 0.88
	var smooth := released * released * (3.0 - 2.0 * released)
	return smooth + sin(released * PI) * 0.018


func _turn_relation_text() -> String:
	var initial_trace := _trace_for_angle(_attempt_start_angle)
	if not initial_trace.get("mirror_hit", false) or not cascade_trace.get("mirror_hit", false):
		return "Шорох: «По разные стороны нормали — одинаковые углы.»"
	var mirror_turn := absf(rad_to_deg(angle_difference(_attempt_start_angle, mirror_angle)))
	var beam_turn := absf(rad_to_deg(angle_difference(initial_trace["reflected_direction"].angle(), cascade_trace["reflected_direction"].angle())))
	return "Шорох: «Зеркало — %d°. Луч — %d°. Вдвое.»" % [roundi(mirror_turn), roundi(beam_turn)]


func _sprite_with_height(texture: Texture2D, center: Vector2, height: float, layer: int) -> Sprite2D:
	var sprite := Sprite2D.new()
	sprite.texture = texture
	sprite.position = center
	var scale_value := height / texture.get_height()
	sprite.scale = Vector2.ONE * scale_value
	sprite.z_index = layer
	return sprite


func _sprite_with_width(texture: Texture2D, center: Vector2, width: float, layer: int) -> Sprite2D:
	var sprite := Sprite2D.new()
	sprite.texture = texture
	sprite.position = center
	var scale_value := width / texture.get_width()
	sprite.scale = Vector2.ONE * scale_value
	sprite.z_index = layer
	return sprite
