import type { Metadata } from "next";
import { DesignLab } from "../../components/design-lab/DesignLab";

export const metadata: Metadata = {
  title: "Лаборатория движения — дизайн-прототип PhysicsLab",
  description: "Интерактивный прототип учебного маршрута о скорости при равнопеременном движении.",
};

export default function DesignLabPage() {
  return <DesignLab />;
}
