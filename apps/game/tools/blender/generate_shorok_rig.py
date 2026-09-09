"""Generate and skin Shorok's fitted Rigify control rig.

Input is the mesh-backed fitting scene produced by
``build_shorok_rig_source.py``.  The output remains WIP until deformation
poses, a walk cycle, sprite renders, and runtime contact checks pass.
"""

from __future__ import annotations

from pathlib import Path

import bpy


PROJECT_ROOT = Path(__file__).resolve().parents[4]
OUTPUT_PATH = (
    PROJECT_ROOT
    / "apps"
    / "game"
    / "art"
    / "characters"
    / "shorok-blender"
    / "shorok-rigged-wip-v1.blend"
)


def stabilize_paw_weights(mesh: bpy.types.Object) -> dict[str, int]:
    """Make the contact pads rigid to their toe deform bones.

    Automatic heat weights are useful for the torso and long feathered tail,
    but the reconstructed low-poly paw pads otherwise blend across several
    ankle bones and visibly stretch during IK travel.  The four source paws are
    disconnected below Z=0.40 and have measured 3D bounds, so assigning only
    those contact volumes rigidly is deterministic and preserves a soft ankle
    transition above the cutoff.
    """

    paw_specs = {
        "DEF-front_toe.L": ((-1.85, -1.10), (-0.90, -0.15)),
        "DEF-front_toe.R": ((-2.85, -1.90), (-0.15, 0.50)),
        "DEF-toe.L": ((0.65, 1.40), (-0.25, 0.55)),
        "DEF-toe.R": ((-0.65, 0.40), (0.55, 1.25)),
    }
    counts: dict[str, int] = {}
    for group_name, ((x_min, x_max), (y_min, y_max)) in paw_specs.items():
        group = mesh.vertex_groups.get(group_name)
        if group is None:
            raise RuntimeError(f"Missing paw deform group: {group_name}")
        indices = [
            vertex.index
            for vertex in mesh.data.vertices
            if vertex.co.z <= 0.40
            and x_min <= vertex.co.x <= x_max
            and y_min <= vertex.co.y <= y_max
        ]
        if len(indices) < 20:
            raise RuntimeError(f"Paw selection too small for {group_name}: {len(indices)}")
        for source in mesh.vertex_groups:
            source.remove(indices)
        group.add(indices, 1.0, "REPLACE")
        counts[group_name] = len(indices)
    return counts


def generate() -> None:
    bpy.ops.preferences.addon_enable(module="rigify")
    mesh = bpy.data.objects.get("GEO_Shорох_TripoSR_WIP")
    metarig = bpy.data.objects.get("RIG_Shорох_fit_WIP")
    if mesh is None or metarig is None:
        raise RuntimeError("Expected fitted mesh and metarig are missing")

    bpy.ops.object.select_all(action="DESELECT")
    metarig.select_set(True)
    bpy.context.view_layer.objects.active = metarig
    bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.pose.rigify_generate()

    rig = bpy.context.object
    if rig is None or rig.type != "ARMATURE" or rig == metarig:
        candidates = [
            obj
            for obj in bpy.context.scene.objects
            if obj.type == "ARMATURE" and obj != metarig
        ]
        if not candidates:
            raise RuntimeError("Rigify did not create a control rig")
        rig = candidates[-1]
    rig.name = "CTRL_Shорох_Rigify_WIP"
    rig["asset_status"] = "WIP_SKINNING_DEFORMATION_QA_REQUIRED"
    rig["object_scale_keyframes_allowed"] = False

    bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="DESELECT")
    mesh.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.parent_set(type="ARMATURE_AUTO")

    paw_counts = stabilize_paw_weights(mesh)

    metarig.hide_viewport = True
    metarig.hide_render = True
    mesh["skin_method"] = "Rigify automatic weights; manual QA pending"
    bpy.context.scene["gate"] = "RIGGED_WIP_DEFORMATION_POSES_REQUIRED"

    notes = bpy.data.texts.get("FIT_REVIEW.md") or bpy.data.texts.new("FIT_REVIEW.md")
    notes.write(
        "\n## Rig generation\n\n"
        "- Rigify controls generated from the fitted metarig.\n"
        "- Automatic weights are only a starting point.\n"
        "- Required next: four planted-paw poses, spine compression, head turn, "
        "tail overlap, and silhouette review before animation.\n"
    )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_PATH))
    print(f"GENERATED_RIG={rig.name}")
    print(f"POSE_BONES={len(rig.pose.bones)}")
    print(f"MESH_GROUPS={len(mesh.vertex_groups)}")
    print(f"RIGID_PAW_VERTICES={paw_counts}")
    print(f"SAVED_RIGGED_SCENE={OUTPUT_PATH}")


if __name__ == "__main__":
    generate()
