# Inertia experiment artwork — 2026-09-08

Prepared with built-in imagegen, not manually painted in Adobe. Not yet integrated or visually accepted in the runtime experiment.

Assets in apps/web/public/images/experiments:
- inertia-cart-v1.png: exec-fa3653db-0f2e-42fb-b653-59962dcbadf5.png. 1536×1024 RGBA, opaque silhouette bbox22,433–1515,635. Long low cream platform, navy chassis, two rubber wheels, restrained teal trim. Alpha checked; flat platform edge and wheel contact require component-level alignment.
- inertia-puck-v1.png: exec-300596dd-1249-47cd-932e-f3fc9068bb33.png. 1536×1024 RGBA, silhouette bbox164,393–1372,655. Brass cylinder side elevation, transparent surround.
- inertia-floor-v1.png: exec-c40718a8-b56a-4d69-96e9-c9e7f95edeed.png. 1536×1024. Warm empty lab wall and oak floor; visible floor begins about y778 (76%), not the requested80%. Use actual asset geometry when integrating.

Prompt specifications:
Cart: isolated side-elevation laboratory dynamics cart, truly transparent background, long uninterrupted horizontal cream enamel platform, navy chassis, teal trim, two small realistic rubber wheels, fine bolts and restrained anime cel-painted shading; no handles, raised lips, rails, objects, text, arrows, diagram, environment or ground shadow. Cart fills x5–95%, y35–75% of3:2 canvas; preserve exact side view.
Puck: isolated brass low solid laboratory sliding cylinder with no hole, side orthographic elevation and small visible top ellipse, machined material, warm lower rim, flat horizontal base. Centre at50%,50%; about70% canvas width and20% height; truly transparent, no floor/shadow/glow/text/arrows.
Floor: empty painted laboratory stage, panoramic3:2, warm off-white wall above a perfectly horizontal oak floor, few clear plank seams and knots as position landmarks, faint reflected cyan daylight, no equipment/people/text/diagrams, flat side elevation without perspective convergence.

Spark delegation
A bounded coding request was submitted to model gpt-5.3-codex-spark in an isolated project worktree. Queued client id: client-new-thread:be6ed6f0-a0ed-42a6-93bf-7651e6a10ddc. The task is to return InertiaModel.tsx and InertiaStage.module.css only. Main agent must review coordinate alignment, integrate, test and inspect live desktop/mobile in both themes before accepting the change. Task has not yet appeared with a server thread id; do not assume the model has started or resubmit a duplicate.
