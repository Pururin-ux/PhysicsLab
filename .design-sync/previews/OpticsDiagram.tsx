import { OpticsDiagram } from "web";

export const Reflection = () => (
  <div style={{ width: 400 }}>
    <OpticsDiagram
      spec={{
        scene: "reflection",
        incidenceAngleDeg: 30,
        reflectionAngleDeg: 30,
        showLabels: true,
      }}
    />
  </div>
);

export const Refraction = () => (
  <div style={{ width: 400 }}>
    <OpticsDiagram
      spec={{
        scene: "refraction",
        incidenceAngleDeg: 45,
        refractionAngleDeg: 30,
        medium1Label: "среда 1 (воздух)",
        medium2Label: "среда 2",
        refractedGiven: true,
      }}
    />
  </div>
);

export const ThinLens = () => (
  <div style={{ width: 400 }}>
    <OpticsDiagram
      spec={{
        scene: "thin_lens",
        lensType: "converging",
        focalLength: 10,
        objectDistance: 30,
        objectHeight: 4,
        imageDistance: 15,
        imageHeight: 2,
        unit: "см",
      }}
    />
  </div>
);

export const PlaneMirror = () => (
  <div style={{ width: 400 }}>
    <OpticsDiagram
      spec={{
        scene: "plane_mirror",
        objectDistance: 40,
        imageDistance: 40,
        unit: "см",
      }}
    />
  </div>
);
