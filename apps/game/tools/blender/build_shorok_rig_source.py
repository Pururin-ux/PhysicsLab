"""Build Shorok's first mesh-backed Rigify fitting scene.

This is a fitting gate, not an animation deliverable.  It imports the locally
reconstructed watertight mesh, establishes a vertex-colour material, places the
mesh on an exact ground plane, and fits the Rigify wolf metarig to the mesh in
world space.  No skinning or animation is allowed until the side/front fitting
views are approved.
"""

from __future__ import annotations

import math
from pathlib import Path

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(__file__).resolve().parents[4]
MESH_PATH = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "shorok-blender"
    / "triposr-v1"
    / "0"
    / "mesh.obj"
)
OUTPUT_PATH = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "shorok-blender"
    / "shorok-mesh-rig-fit-v1.blend"
)

TARGET_HEIGHT = 4.02
GROUND_Z = 0.0


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (
        bpy.data.armatures,
        bpy.data.cameras,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.meshes,
    ):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def world_bounds(obj: bpy.types.Object) -> tuple[Vector, Vector]:
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    minimum = Vector(tuple(min(point[i] for point in corners) for i in range(3)))
    maximum = Vector(tuple(max(point[i] for point in corners) for i in range(3)))
    return minimum, maximum


def build_vertex_colour_material(mesh: bpy.types.Object) -> None:
    material = bpy.data.materials.new("MAT_Shорох_vertex_colour_WIP")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    for node in list(nodes):
        nodes.remove(node)

    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    colour = nodes.new("ShaderNodeVertexColor")
    colour.layer_name = "Color"
    shader.inputs["Roughness"].default_value = 0.72
    shader.inputs["Metallic"].default_value = 0.0
    shader.inputs["Specular IOR Level"].default_value = 0.22
    links.new(colour.outputs["Color"], shader.inputs["Base Color"])
    links.new(colour.outputs["Alpha"], shader.inputs["Alpha"])
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    mesh.data.materials.append(material)


def import_mesh() -> bpy.types.Object:
    if not MESH_PATH.exists():
        raise FileNotFoundError(MESH_PATH)
    bpy.ops.wm.obj_import(filepath=str(MESH_PATH))
    mesh = bpy.context.object
    mesh.name = "GEO_Shорох_TripoSR_WIP"

    # TripoSR's approved side view looks along +X, with image horizontal on Y.
    # Rotate once so Blender/Godot sprite horizontal is X and keep Z vertical.
    mesh.rotation_euler = (0.0, 0.0, math.radians(-90.0))
    bpy.context.view_layer.objects.active = mesh
    mesh.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

    minimum, maximum = world_bounds(mesh)
    scale = TARGET_HEIGHT / (maximum.z - minimum.z)
    mesh.scale = (scale, scale, scale)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    minimum, maximum = world_bounds(mesh)
    mesh.location.z += GROUND_Z - minimum.z
    minimum, maximum = world_bounds(mesh)
    mesh.location.x -= (minimum.x + maximum.x) * 0.5
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)

    build_vertex_colour_material(mesh)
    for polygon in mesh.data.polygons:
        polygon.use_smooth = True
    mesh["asset_status"] = "WIP_RECONSTRUCTION_UNSKINNED"
    mesh["ground_z"] = GROUND_Z
    mesh["source_mesh"] = str(MESH_PATH)
    return mesh


def build_fitted_metarig() -> bpy.types.Object:
    bpy.ops.preferences.addon_enable(module="rigify")
    bpy.ops.object.armature_wolf_metarig_add()
    rig = bpy.context.object
    rig.name = "RIG_Shорох_fit_WIP"
    rig.rotation_euler = (0.0, 0.0, math.radians(-90.0))
    rig.scale = (3.87, 3.87, 3.87)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    rig.show_in_front = True
    rig.display_type = "WIRE"

    # Fit the authored tail chain to the reconstructed silhouette.  The stock
    # wolf tail overshoots Shorok's feathered tail by more than half a unit.
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode="EDIT")
    edit = rig.data.edit_bones
    tail_points = [
        Vector((1.42, 0.0, 2.44)),
        Vector((1.94, 0.0, 2.43)),
        Vector((2.52, 0.0, 2.48)),
        Vector((3.08, 0.0, 2.61)),
        Vector((3.58, 0.0, 2.84)),
    ]
    tail_names = ["spine.003", "spine.002", "spine.001", "spine"]
    for index, name in enumerate(tail_names):
        bone = edit.get(name)
        if bone is not None:
            bone.head = tail_points[index]
            bone.tail = tail_points[index + 1]

    spine_points = [
        Vector((1.42, 0.0, 2.44)),
        Vector((0.94, 0.0, 2.43)),
        Vector((0.47, 0.0, 2.43)),
        Vector((0.00, 0.0, 2.44)),
        Vector((-0.46, 0.0, 2.48)),
        Vector((-1.25, 0.0, 2.62)),
        Vector((-1.55, 0.0, 2.78)),
        Vector((-1.82, 0.0, 2.94)),
        Vector((-2.34, 0.0, 3.20)),
    ]
    spine_names = [
        "spine.004",
        "spine.005",
        "spine.006",
        "spine.007",
        "spine.008",
        "spine.009",
        "spine.010",
        "spine.011",
    ]
    for index, name in enumerate(spine_names):
        bone = edit.get(name)
        if bone is not None:
            bone.head = spine_points[index]
            bone.tail = spine_points[index + 1]

    # The generated body sits slightly lower and longer through the shoulder
    # than the stock metarig.  These landmarks keep every deform chain inside
    # the actual volume; later approval is visual, not inferred from numbers.
    landmark_updates = {
        # The approved anchor is a staggered natural stance, not a mirrored
        # T-pose.  Low-Z connected-component analysis identifies four distinct
        # paw volumes, so each L/R chain is fitted to its actual 3D component
        # instead of being forced into overlapping screen-space limbs.
        "shoulder.L": ((-0.86, -0.22, 2.86), (-1.24, -0.50, 2.55)),
        "front_thigh.L": ((-1.24, -0.50, 2.55), (-1.30, -0.50, 1.56)),
        "front_shin.L": ((-1.30, -0.50, 1.56), (-1.37, -0.50, 0.56)),
        "front_foot.L": ((-1.37, -0.50, 0.56), (-1.43, -0.50, 0.15)),
        "front_toe.L": ((-1.43, -0.50, 0.15), (-1.72, -0.50, 0.06)),
        "shoulder.R": ((-0.96, 0.20, 2.86), (-1.62, 0.19, 2.55)),
        "front_thigh.R": ((-1.62, 0.19, 2.55), (-1.84, 0.19, 1.62)),
        "front_shin.R": ((-1.84, 0.19, 1.62), (-2.15, 0.18, 0.63)),
        "front_foot.R": ((-2.15, 0.18, 0.63), (-2.32, 0.18, 0.15)),
        "front_toe.R": ((-2.32, 0.18, 0.15), (-2.62, 0.18, 0.06)),
        "pelvis.L": ((1.42, 0.0, 2.18), (0.82, 0.17, 2.55)),
        "thigh.L": ((0.82, 0.17, 2.55), (0.56, 0.17, 1.64)),
        "shin.L": ((0.56, 0.17, 1.64), (1.20, 0.17, 0.76)),
        "foot.L": ((1.20, 0.17, 0.76), (1.15, 0.17, 0.15)),
        "toe.L": ((1.15, 0.17, 0.15), (0.82, 0.17, 0.06)),
        "pelvis.R": ((1.42, 0.0, 2.18), (0.55, 0.95, 2.50)),
        "thigh.R": ((0.55, 0.95, 2.50), (0.35, 0.95, 1.60)),
        "shin.R": ((0.35, 0.95, 1.60), (0.15, 0.95, 0.75)),
        "foot.R": ((0.15, 0.95, 0.75), (0.10, 0.95, 0.15)),
        "toe.R": ((0.10, 0.95, 0.15), (-0.20, 0.95, 0.05)),
        "breast.L": ((-0.70, -0.16, 2.46), (-1.26, -0.18, 2.18)),
        "breast.R": ((-0.70, 0.16, 2.46), (-1.26, 0.18, 2.18)),
    }
    for name, (head, tail) in landmark_updates.items():
        bone = edit.get(name)
        if bone is not None:
            bone.head = head
            bone.tail = tail

    # Keep the review view anatomical and readable.  Rigify's detailed facial
    # loops and individual toe bones remain present for generation, but they do
    # not obscure the primary joint fitting gate.
    review_hidden_prefixes = (
        "lip.",
        "brow.",
        "lid.",
        "forehead.",
        "temple.",
        "cheek.",
        "teeth.",
        "tongue",
        "f_palm.",
        "f_pinky.",
        "f_ring.",
        "f_middle.",
        "f_index.",
        "r_palm.",
        "r_pinky.",
        "r_ring.",
        "r_middle.",
        "r_index.",
    )
    for bone in edit:
        if bone.name.startswith(review_hidden_prefixes):
            bone.hide = True

    bpy.ops.object.mode_set(mode="OBJECT")
    rig["asset_status"] = "WIP_FIT_BEFORE_SKINNING"
    rig["scale_keys_allowed"] = False
    rig["ground_contact_z"] = GROUND_Z
    return rig


def add_camera(name: str, location: tuple[float, float, float], ortho: float) -> bpy.types.Object:
    data = bpy.data.cameras.new(name)
    camera = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(camera)
    camera.location = location
    camera.rotation_euler = (math.radians(90.0), 0.0, 0.0)
    data.type = "ORTHO"
    data.ortho_scale = ortho
    return camera


def configure_scene(mesh: bpy.types.Object, rig: bpy.types.Object) -> None:
    scene = bpy.context.scene
    side = add_camera("CAM_Shорох_side_fit", (0.0, -16.0, 2.08), 7.9)
    scene.camera = side
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 800
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.fps = 24
    scene.frame_start = 1
    scene.frame_end = 48
    scene.world.color = (0.025, 0.022, 0.020)
    scene["gate"] = "FIT_REVIEW_REQUIRED_BEFORE_SKINNING"
    scene["root_scale_keys_allowed"] = False

    # Ground is a viewport-only fitting reference, never a runtime asset.
    bpy.ops.mesh.primitive_plane_add(size=16.0, location=(0.0, 0.0, GROUND_Z))
    ground = bpy.context.object
    ground.name = "GUIDE_ground_contact_Z0"
    ground.display_type = "WIRE"
    ground.hide_render = True

    notes = bpy.data.texts.new("FIT_REVIEW.md")
    notes.write(
        "# Shorok mesh/rig fitting gate\n\n"
        "- This replaces the rejected image-only metarig screenshot.\n"
        "- Mesh is grounded exactly at Z=0 and has fixed applied scale.\n"
        "- Verify side and front views before generating the Rigify rig.\n"
        "- Reject if any leg chain leaves the limb volume or a contact socket "
        "misses the paw.\n"
        "- Do not skin, key scale, or animate until this fitting gate passes.\n"
    )

    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    mesh.select_set(False)


def main() -> None:
    clear_scene()
    mesh = import_mesh()
    rig = build_fitted_metarig()
    configure_scene(mesh, rig)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_PATH))
    minimum, maximum = world_bounds(mesh)
    print(f"MESH_BOUNDS_MIN={tuple(round(v, 4) for v in minimum)}")
    print(f"MESH_BOUNDS_MAX={tuple(round(v, 4) for v in maximum)}")
    print(f"SAVED_FIT_SCENE={OUTPUT_PATH}")


if __name__ == "__main__":
    main()
