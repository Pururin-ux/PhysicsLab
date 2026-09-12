"""Author and render Shorok's 24-frame quadruped walk cycle.

The cycle is in-place and is intended to be driven by travelled distance in
Godot.  Four paws use a four-beat walk with a long planted phase and a shorter
lift/swing phase.  Torso, head and tail motion is articulated on the rig; no
object or pose-bone scale channel is keyed.
"""

from __future__ import annotations

import math
from pathlib import Path

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(__file__).resolve().parents[4]
OUTPUT_DIR = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "shorok-walk-blender-v1"
)
FRAME_DIR = OUTPUT_DIR / "frames"
SOURCE_BLEND = OUTPUT_DIR / "shorok-walk-source-v1.blend"

FPS = 24
FRAME_COUNT = 24
STANCE_FRACTION = 0.62
STRIDE = 1.10
PAW_LIFT = 0.40


def point_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def add_area(
    name: str,
    location: tuple[float, float, float],
    energy: float,
    size: float,
    colour: tuple[float, float, float],
) -> None:
    data = bpy.data.lights.new(name, type="AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = size
    data.color = colour
    light = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(light)
    light.location = location
    point_at(light, Vector((0.0, 0.0, 2.0)))


def configure_render() -> None:
    for obj in list(bpy.data.objects):
        if obj.type == "LIGHT":
            bpy.data.objects.remove(obj, do_unlink=True)
    add_area("KEY_fog_cream", (-4.0, -6.0, 7.0), 850.0, 5.0, (1.0, 0.76, 0.54))
    add_area("FILL_plum", (4.5, -3.0, 4.0), 550.0, 4.0, (0.34, 0.22, 0.36))
    add_area("RIM_cool", (1.5, 5.0, 6.0), 900.0, 3.5, (0.48, 0.62, 0.68))

    material = bpy.data.materials.get("MAT_Shорох_vertex_colour_WIP")
    if material is not None and material.use_nodes:
        nodes = material.node_tree.nodes
        links = material.node_tree.links
        shader = next((node for node in nodes if node.type == "BSDF_PRINCIPLED"), None)
        colour = next((node for node in nodes if node.type == "VERTEX_COLOR"), None)
        if shader is not None and colour is not None:
            emission = shader.inputs.get("Emission Color")
            strength = shader.inputs.get("Emission Strength")
            if emission is not None and not emission.is_linked:
                links.new(colour.outputs["Color"], emission)
            if strength is not None:
                strength.default_value = 0.12

    scene = bpy.context.scene
    camera = bpy.data.objects.get("CAM_Shорох_side_fit")
    if camera is None:
        raise RuntimeError("Side render camera is missing")
    camera.location = (0.0, -16.0, 2.94)
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 8.0
    scene.camera = camera
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 512
    scene.render.resolution_y = 512
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.fps = FPS
    scene.render.fps_base = 1.0
    scene.frame_start = 1
    scene.frame_end = FRAME_COUNT
    scene.render.filepath = str(FRAME_DIR / "shorok-walk-")
    scene.view_settings.look = "AgX - Medium High Contrast"


def reset_pose(rig: bpy.types.Object) -> None:
    rig.animation_data_clear()
    for bone in rig.pose.bones:
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_mode = "XYZ"
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def gait_offset(phase: float) -> tuple[float, float]:
    phase %= 1.0
    if phase < STANCE_FRACTION:
        progress = phase / STANCE_FRACTION
        x = -STRIDE * 0.5 + STRIDE * progress
        return x, 0.0
    progress = (phase - STANCE_FRACTION) / (1.0 - STANCE_FRACTION)
    eased = 0.5 - 0.5 * math.cos(math.pi * progress)
    x = STRIDE * 0.5 - STRIDE * eased
    z = PAW_LIFT * math.sin(math.pi * progress) ** 1.25
    return x, z


def key_location(bone: bpy.types.PoseBone, frame: int, location: tuple[float, float, float]) -> None:
    bone.location = location
    bone.keyframe_insert(data_path="location", frame=frame, group=bone.name)


def key_rotation_y(bone: bpy.types.PoseBone, frame: int, degrees: float) -> None:
    bone.rotation_mode = "XYZ"
    bone.rotation_euler = (0.0, math.radians(degrees), 0.0)
    bone.keyframe_insert(data_path="rotation_euler", frame=frame, group=bone.name)


def author_cycle(rig: bpy.types.Object) -> None:
    reset_pose(rig)
    legs = {
        # Four-beat walk: near hind -> near fore -> far hind -> far fore.
        "foot_ik.L": (0.00, 0.00),
        "front_foot_ik.L": (0.25, 0.00),
        "foot_ik.R": (0.50, 0.00),
        "front_foot_ik.R": (0.75, 0.00),
    }
    required = list(legs) + ["hips", "chest", "head", "spine.003", "spine.002", "spine.001", "spine"]
    missing = [name for name in required if rig.pose.bones.get(name) is None]
    if missing:
        raise RuntimeError(f"Required Rigify controls are missing: {missing}")

    for frame in range(1, FRAME_COUNT + 1):
        cycle = (frame - 1) / FRAME_COUNT
        for name, (phase_offset, contact_z) in legs.items():
            x, z = gait_offset(cycle + phase_offset)
            key_location(rig.pose.bones[name], frame, (x, 0.0, z + contact_z))

        # Restrained mass transfer: hips lead, chest follows, head stabilizes.
        hips_z = -0.018 + 0.035 * math.cos(4.0 * math.pi * cycle)
        chest_z = 0.018 * math.cos(4.0 * math.pi * cycle + 0.75)
        head_z = 0.012 * math.cos(4.0 * math.pi * cycle + 1.35)
        key_location(rig.pose.bones["hips"], frame, (0.0, 0.0, hips_z))
        key_location(rig.pose.bones["chest"], frame, (0.0, 0.0, chest_z))
        key_location(rig.pose.bones["head"], frame, (0.0, 0.0, head_z))
        key_rotation_y(rig.pose.bones["hips"], frame, 1.7 * math.sin(2.0 * math.pi * cycle))
        key_rotation_y(rig.pose.bones["chest"], frame, -1.15 * math.sin(2.0 * math.pi * cycle + 0.25))
        key_rotation_y(rig.pose.bones["head"], frame, -1.2 - 0.75 * math.sin(2.0 * math.pi * cycle + 0.55))

        # Feathered tail carries the phase backward as overlapping follow-through.
        for index, name in enumerate(("spine.003", "spine.002", "spine.001", "spine")):
            lag = 0.35 + index * 0.38
            amplitude = 2.2 + index * 0.85
            angle = 1.6 + amplitude * math.sin(2.0 * math.pi * cycle - lag)
            key_rotation_y(rig.pose.bones[name], frame, angle)

    # No scale keys are authored: the only insertion helpers above target
    # location and rotation_euler.  Blender 5 stores curves in layered channel
    # bags rather than Action.fcurves, so the runtime QA checks fixed object and
    # pose scale separately instead of relying on the removed legacy API.
    action = rig.animation_data.action if rig.animation_data else None
    if action is None:
        raise RuntimeError("Walk action was not created")
    action.name = "Shorok_Walk_24f_WIP"


def add_notes(rig: bpy.types.Object) -> None:
    notes = bpy.data.texts.get("WALK_CONTRACT.md") or bpy.data.texts.new("WALK_CONTRACT.md")
    notes.clear()
    notes.write(
        "# Shorok 24-frame walk WIP\n\n"
        "- 24 unique frames at 24 fps; Godot phase is driven by travelled distance.\n"
        "- Four-beat quadruped gait with 62% planted duty cycle.\n"
        "- No object or bone scale channels.\n"
        "- Ground baseline is 444 px on a 512 px transparent canvas.\n"
        "- Pending: contact-sheet review, runtime paw-slip check, native-phone QA.\n"
    )
    rig["animation_status"] = "WIP_RENDER_AND_RUNTIME_QA_REQUIRED"
    rig["walk_frames"] = FRAME_COUNT
    rig["walk_fps"] = FPS
    rig["scale_channels_allowed"] = False


def main() -> None:
    rig = bpy.data.objects.get("CTRL_Shорох_Rigify_WIP")
    if rig is None:
        raise RuntimeError("Rigify control rig is missing")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    FRAME_DIR.mkdir(parents=True, exist_ok=True)
    configure_render()
    author_cycle(rig)
    add_notes(rig)
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE_BLEND))
    bpy.ops.render.render(animation=True)
    print(f"SAVED_WALK_SOURCE={SOURCE_BLEND}")
    print(f"RENDERED_WALK_FRAMES={FRAME_COUNT}")
    print(f"FRAME_DIR={FRAME_DIR}")


if __name__ == "__main__":
    main()
