"""Create the reproducible Blender workbench for Shorok's 3D-to-2D animation.

The scene deliberately contains no proxy mesh.  It establishes the real
production camera, the approved character reference, a Rigify wolf metarig,
collections for the generated model, and sprite-render settings.  The mesh is
added only after the image-to-3D source passes silhouette review.
"""

from __future__ import annotations

import math
from pathlib import Path

import bpy


PROJECT_ROOT = Path(__file__).resolve().parents[4]
REFERENCE_PATH = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "source"
    / "shorok-anchor-v2-source.png"
)
OUTPUT_PATH = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "shorok-blender"
    / "shorok-rig-workbench-v1.blend"
)


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        if collection.name != "Collection":
            bpy.data.collections.remove(collection)
    root = bpy.data.collections.get("Collection")
    if root is not None:
        root.name = "SHOROK_PRODUCTION"


def make_collection(name: str) -> bpy.types.Collection:
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection


def move_to_collection(obj: bpy.types.Object, collection: bpy.types.Collection) -> None:
    for source in list(obj.users_collection):
        source.objects.unlink(obj)
    collection.objects.link(obj)


def build_reference(collection: bpy.types.Collection) -> bpy.types.Object:
    image = bpy.data.images.load(str(REFERENCE_PATH), check_existing=True)
    reference = bpy.data.objects.new("REF_Shорох_approved_side", None)
    reference.empty_display_type = "IMAGE"
    reference.data = image
    reference.color[3] = 0.62
    reference.empty_display_size = 8.6
    reference.empty_image_depth = "BACK"
    reference.rotation_euler = (math.radians(90.0), 0.0, 0.0)
    # The source paws touch the lower edge; place that edge on the rig's Z=0
    # ground plane so all later walk clips share a measurable contact line.
    reference.location = (0.0, 0.42, 2.0)
    collection.objects.link(reference)
    reference.hide_render = True
    reference["asset_status"] = "WIP_REFERENCE"
    reference["ground_contact_z"] = 0.0
    return reference


def build_metarig(collection: bpy.types.Collection) -> bpy.types.Object:
    bpy.ops.preferences.addon_enable(module="rigify")
    bpy.ops.object.armature_wolf_metarig_add()
    metarig = bpy.context.object
    metarig.name = "RIG_Shорох_wolf_metarig"
    metarig.location = (0.0, 0.0, 0.0)
    # Rigify's wolf points along Y. Shorok's camera reads X as screen
    # horizontal, so rotate once during setup and apply all transforms.
    metarig.rotation_euler = (0.0, 0.0, math.radians(-90.0))
    metarig.scale = (3.87, 3.87, 3.87)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    move_to_collection(metarig, collection)
    metarig.show_in_front = True
    metarig["rig_contract"] = "single stable scale; paws share ground plane; no root scale keys"
    return metarig


def build_camera(collection: bpy.types.Collection) -> bpy.types.Object:
    camera_data = bpy.data.cameras.new("CAM_Shорох_sprite_ortho")
    camera = bpy.data.objects.new("CAM_Shорох_sprite_ortho", camera_data)
    collection.objects.link(camera)
    camera.location = (0.0, -16.0, 3.15)
    camera.rotation_euler = (math.radians(90.0), 0.0, 0.0)
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = 7.2
    camera_data.lens = 70.0
    camera_data.dof.use_dof = False
    bpy.context.scene.camera = camera
    return camera


def configure_render() -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 1024
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.fps = 24
    scene.render.fps_base = 1.0
    scene.render.use_file_extension = True
    scene.frame_start = 1
    scene.frame_end = 48
    scene.world.color = (0.018, 0.012, 0.009)
    scene["sprite_contract"] = (
        "orthographic RGBA; 24 fps source; walk 16 frames; start 6; stop 6; "
        "idle/reaction 12; fixed camera and root scale"
    )


def add_scene_notes() -> None:
    text = bpy.data.texts.new("PRODUCTION_NOTES.md")
    text.write(
        "# Shorok animation workbench\n\n"
        "- Approved look: `shorok-anchor-v2-source.png`.\n"
        "- Mesh must pass side silhouette and identity review before skinning.\n"
        "- Rig: Rigify wolf, fitted in edit mode to the approved mesh.\n"
        "- Never key object scale. Root translation is horizontal only.\n"
        "- Walk source is authored at 24 fps and sampled to 16 game frames.\n"
        "- Separate clips: anticipation/start, walk, stop/settle, idle/reaction.\n"
        "- Render with this orthographic camera to transparent RGBA.\n"
    )


def main() -> None:
    if not REFERENCE_PATH.exists():
        raise FileNotFoundError(REFERENCE_PATH)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    clear_scene()
    reference_collection = make_collection("01_REFERENCE")
    model_collection = make_collection("02_MODEL_WIP")
    rig_collection = make_collection("03_RIG")
    camera_collection = make_collection("04_RENDER")
    build_reference(reference_collection)
    build_metarig(rig_collection)
    build_camera(camera_collection)
    model_collection["gate"] = "EMPTY_UNTIL_APPROVED_3D_SOURCE"
    configure_render()
    add_scene_notes()
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_PATH))
    print(f"SAVED_WORKBENCH={OUTPUT_PATH}")


if __name__ == "__main__":
    main()
