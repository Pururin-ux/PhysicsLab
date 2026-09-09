class_name LivingAutumnBackground
extends Node2D

const VIEW_SIZE := Vector2(390.0, 844.0)
const FAR_TEXTURE := preload("res://art/environment/autumn-observatory-far-bg-v1.png")
const FOREGROUND_TEXTURE := preload("res://art/environment/autumn-observatory-foreground-v2.png")
const CANOPY_LEFT_TEXTURE := preload("res://art/environment/autumn-canopy-left-v1.png")
const CANOPY_RIGHT_TEXTURE := preload("res://art/environment/autumn-canopy-right-v1.png")
const MIST_TEXTURE := preload("res://art/environment/mist-ribbons-v2.png")
const LEAF_TEXTURE := preload("res://art/environment/autumn-leaf-particle-game-v2.png")

var reduced_motion := false
var wind_strength := 1.0

var _time := 0.0
var _far: Sprite2D
var _mist: Sprite2D
var _left_pivot: Node2D
var _right_pivot: Node2D
var _left_canopy: Sprite2D
var _right_canopy: Sprite2D
var _leaves: CPUParticles2D


func _ready() -> void:
	_build_layers()


func _process(delta: float) -> void:
	_time += delta
	var motion_scale := 0.16 if reduced_motion else 1.0
	var gust := pow(maxf(0.0, sin(_time * 0.23 - 1.1)), 8.0)
	var breeze := sin(_time * 0.72) * 0.55 + sin(_time * 1.13 + 0.8) * 0.18
	var wind := (breeze + gust * 1.45) * wind_strength * motion_scale

	_far.position = VIEW_SIZE * 0.5 + Vector2(
		sin(_time * 0.075) * 1.6,
		cos(_time * 0.052) * 0.9
	) * motion_scale
	_mist.position = VIEW_SIZE * 0.5 + Vector2(
		sin(_time * 0.11 + 1.6) * 13.0,
		cos(_time * 0.08) * 2.4
	) * motion_scale

	_left_pivot.rotation = deg_to_rad(0.45 * wind + sin(_time * 0.41) * 0.16 * motion_scale)
	_right_pivot.rotation = deg_to_rad(-0.34 * wind + sin(_time * 0.53 + 2.0) * 0.14 * motion_scale)
	_left_canopy.scale.y = _left_canopy.scale.x * (1.0 + wind * 0.0025)
	_right_canopy.scale.y = _right_canopy.scale.x * (1.0 - wind * 0.002)

	_leaves.speed_scale = 0.18 if reduced_motion else 0.86 + gust * 0.75
	_leaves.gravity = Vector2(3.0 + gust * 8.0, 7.0 + gust * 4.0)


func set_reduced_motion(enabled: bool) -> void:
	reduced_motion = enabled
	if is_instance_valid(_leaves):
		_leaves.amount = 3 if enabled else 11


func _build_layers() -> void:
	_far = _full_canvas_sprite(FAR_TEXTURE, -30)
	_far.name = "Far forest and observatory"
	add_child(_far)

	_mist = _full_canvas_sprite(MIST_TEXTURE, -24)
	_mist.name = "Drifting mist"
	_mist.modulate = Color(0.92, 0.84, 0.78, 0.13)
	add_child(_mist)

	_left_pivot = Node2D.new()
	_left_pivot.name = "Left canopy wind pivot"
	_left_pivot.position = Vector2.ZERO
	_left_pivot.z_index = -18
	add_child(_left_pivot)
	_left_canopy = _anchored_canopy(CANOPY_LEFT_TEXTURE, 0.73, false)
	_left_pivot.add_child(_left_canopy)

	_right_pivot = Node2D.new()
	_right_pivot.name = "Right canopy wind pivot"
	_right_pivot.position = Vector2(VIEW_SIZE.x, 0.0)
	_right_pivot.z_index = -17
	add_child(_right_pivot)
	_right_canopy = _anchored_canopy(CANOPY_RIGHT_TEXTURE, 0.84, true)
	_right_pivot.add_child(_right_canopy)

	var foreground := _full_canvas_sprite(FOREGROUND_TEXTURE, -10)
	foreground.name = "Stable foreground cliffs"
	add_child(foreground)

	_leaves = CPUParticles2D.new()
	_leaves.name = "Windblown leaf particles"
	_leaves.z_index = -7
	_leaves.position = Vector2(VIEW_SIZE.x * 0.52, -26.0)
	_leaves.texture = LEAF_TEXTURE
	_leaves.amount = 11
	_leaves.lifetime = 8.5
	_leaves.preprocess = 7.0
	_leaves.randomness = 0.76
	_leaves.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	_leaves.emission_rect_extents = Vector2(230.0, 18.0)
	_leaves.direction = Vector2(0.72, 1.0)
	_leaves.spread = 24.0
	_leaves.initial_velocity_min = 18.0
	_leaves.initial_velocity_max = 36.0
	_leaves.angular_velocity_min = -95.0
	_leaves.angular_velocity_max = 120.0
	_leaves.scale_amount_min = 0.016
	_leaves.scale_amount_max = 0.038
	_leaves.gravity = Vector2(3.0, 7.0)
	_leaves.color = Color(0.86, 0.72, 0.58, 0.74)
	add_child(_leaves)


func _full_canvas_sprite(texture: Texture2D, layer: int) -> Sprite2D:
	var sprite := Sprite2D.new()
	sprite.texture = texture
	sprite.position = VIEW_SIZE * 0.5
	var cover_scale := maxf(VIEW_SIZE.x / texture.get_width(), VIEW_SIZE.y / texture.get_height())
	sprite.scale = Vector2.ONE * cover_scale
	sprite.z_index = layer
	return sprite


func _anchored_canopy(texture: Texture2D, relative_scale: float, anchor_right: bool) -> Sprite2D:
	var sprite := Sprite2D.new()
	sprite.texture = texture
	var cover_scale := maxf(VIEW_SIZE.x / texture.get_width(), VIEW_SIZE.y / texture.get_height())
	var scale_value := cover_scale * relative_scale
	sprite.scale = Vector2.ONE * scale_value
	var half_size := Vector2(texture.get_width(), texture.get_height()) * scale_value * 0.5
	sprite.position = Vector2(-half_size.x if anchor_right else half_size.x, half_size.y)
	return sprite
