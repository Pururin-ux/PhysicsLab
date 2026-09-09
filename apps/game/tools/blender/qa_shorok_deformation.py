"""Render deterministic rest/pose deformation checks for Shorok's WIP rig."""

from __future__ import annotations

import math
from pathlib import Path

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(__file__).resolve().parents[4]
REVIEW_DIR = PROJECT_ROOT / "apps" / "game" / "art" / "reviews"
POSE_BLEND = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "shorok-blender"
    / "shorok-deformation-qa-wip-v1.blend"
)


def point_at(obj: bpy.types.Object, target: Vector) -> None:
    direction = target - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def add_area(name: str, location: tuple[float, float, float], energy: float, size: float, colour: tuple[float, float, float]) -> None:
    data = bpy.data.lights.new(name, type="AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = size
    data.color = colour
    light = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(light)
    light.location = location
    point_at(light, Vector((0.0, 0.0, 2.0)))


def configure_render_look() -> None:
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
            if emission is not None:
                links.new(colour.outputs["Color"], emission)
            if strength is not None:
                strength.default_value = 0.12

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 800
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.render.image_settings.color_depth = "8"


def render(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.context.scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    print(f"RENDERED={path}")


def reset_pose(rig: bpy.types.Object) -> None:
    for bone in rig.pose.bones:
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_mode = "QUATERNION"
        bone.rotation_quaternion = (1.0, 0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def apply_review_pose(rig: bpy.types.Object) -> None:
    reset_pose(rig)
    lift = rig.pose.bones.get("front_foot_ik.L")
    if lift is not None:
        lift.location += Vector((-0.22, 0.0, 0.58))

    head = rig.pose.bones.get("head")
    if head is not None:
        head.rotation_mode = "XYZ"
        head.rotation_euler.y = math.radians(-7.0)

    chest = rig.pose.bones.get("chest")
    if chest is not None:
        chest.rotation_mode = "XYZ"
        chest.rotation_euler.y = math.radians(4.0)

    tail_angles = [7.0, -10.0, -8.0, 5.0]
    for name, angle in zip(("spine.003", "spine.002", "spine.001", "spine"), tail_angles):
        bone = rig.pose.bones.get(name)
        if bone is not None:
            bone.rotation_mode = "XYZ"
            bone.rotation_euler.y = math.radians(angle)

    bpy.context.view_layer.update()


def main() -> None:
    rig = bpy.data.objects.get("CTRL_Shорох_Rigify_WIP")
    if rig is None:
        raise RuntimeError("Rigify control rig is missing")
    configure_render_look()
    reset_pose(rig)
    bpy.context.view_layer.update()
    render(REVIEW_DIR / "shorok-deformation-rest-v1.png")
    apply_review_pose(rig)
    render(REVIEW_DIR / "shorok-deformation-lift-paw-v1.png")
    bpy.context.scene["gate"] = "DEFORMATION_QA_WIP_NOT_ACCEPTED"
    bpy.ops.wm.save_as_mainfile(filepath=str(POSE_BLEND))
    print(f"SAVED_POSE_QA={POSE_BLEND}")


if __name__ == "__main__":
    main()
