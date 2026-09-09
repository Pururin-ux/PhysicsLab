extends SceneTree

const FRAME_DIRECTORY := "res://art/characters/shorok-walk-runtime-v1"
const FRAME_COUNT := 24
const EXPECTED_BASELINE_Y := 444

var checks := 0
var failures := 0


func _init() -> void:
	call_deferred("_run")


func _run() -> void:
	var widths: Array[int] = []
	for frame_index in range(FRAME_COUNT):
		var path := "%s/shorok-walk-%02d.png" % [FRAME_DIRECTORY, frame_index]
		var texture: Texture2D = load(path)
		_check(texture != null, "%s must load as Texture2D" % path)
		var image := texture.get_image()
		_check(image.get_width() == 512 and image.get_height() == 512, "%s canvas must be 512x512" % path)
		var bounds := _visible_bounds(image)
		_check(bounds.position.x >= 20.0 and bounds.end.x <= 492.0, "%s needs at least 20 px horizontal export padding" % path)
		_check(bounds.position.y >= 20.0 and bounds.end.y <= 492.0, "%s needs at least 20 px vertical export padding" % path)
		_check(int(bounds.end.y) - 1 == EXPECTED_BASELINE_Y, "%s paws must share baseline %d" % [path, EXPECTED_BASELINE_Y])
		widths.append(int(bounds.size.x))

	var width_spread: int = widths.max() - widths.min()
	_check(width_spread <= 6, "walk-frame silhouette width spread must stay <= 6 px, got %d" % width_spread)
	_check(widths.size() == FRAME_COUNT, "walk must contain %d authored frames" % FRAME_COUNT)
	if failures > 0:
		push_error("FAIL: %d animation-asset checks failed" % failures)
		quit(1)
		return
	print("PASS: %d animation-asset checks; widths=%s" % [checks, widths])
	quit(0)


func _visible_bounds(image: Image) -> Rect2:
	var min_x := image.get_width()
	var min_y := image.get_height()
	var max_x := -1
	var max_y := -1
	for y in range(image.get_height()):
		for x in range(image.get_width()):
			if image.get_pixel(x, y).a >= 0.05:
				min_x = mini(min_x, x)
				min_y = mini(min_y, y)
				max_x = maxi(max_x, x)
				max_y = maxi(max_y, y)
	_check(max_x >= 0, "frame must contain visible pixels")
	return Rect2(min_x, min_y, max_x - min_x + 1, max_y - min_y + 1)


func _check(condition: bool, message: String) -> void:
	if not condition:
		push_error("FAIL: %s" % message)
		failures += 1
		return
	checks += 1
