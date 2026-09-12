# «Лис, которого не было» — vertical-slice gray box

This package is a portrait Godot prototype of the signature loop:

`tune mirror → forecast beam exit → commit → assign fox hold → deterministic cascade → traverse stable echo → inspect discrepancy/retry`

It is deliberately a gray box. The files under `art/concepts/` define the active «Поздний Предел» art direction but are not used as full-screen runtime backgrounds. Final rooms must be assembled from reusable layers and solver-independent visual shells.

## Controls

- Drag near the mirror to rotate it.
- Tap **ВИДЕТЬ ЭХО**, then drag the marker on the right wall.
- Toggle whether Шорох holds the mirror.
- Tap **ЗАКРЕПИТЬ** to run the cascade.
- After settling, retry or load the next source variant.

## Verification

With Godot 4.7.2 on `PATH`:

```powershell
godot --headless --path apps/game --script res://tests/test_runner.gd
godot --headless --path apps/game --script res://tests/room_flow_test.gd
```

Expected result: `13` optics checks and `10` room-flow checks pass.

To refresh the portrait review captures on Windows:

```powershell
godot --path apps/game --display-driver windows --rendering-method gl_compatibility --script res://tests/capture_scene.gd
```

## Android debug export

The checked-in preset exports a signed offline debug APK for arm64:

```powershell
godot --headless --path apps/game --export-debug "Android Debug" apps/game/builds/android/fox-that-never-was-debug.apk
```

Local prerequisites follow the Godot 4.7 Android setup: OpenJDK 17, Android Platform/Build Tools 35, Platform Tools, CMake 3.10.2, and NDK r28b. A store release will require a production icon, private release keystore, AAB/Gradle export, package-name ownership, and device/playtest validation.
