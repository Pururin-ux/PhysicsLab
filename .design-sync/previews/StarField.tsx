import { StarField } from "web";

export const Backdrop = () => (
  <div
    style={{
      position: "relative",
      width: 560,
      height: 220,
      overflow: "hidden",
      borderRadius: 14,
      background: "#07081E",
    }}
  >
    <StarField />
    <div
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <p className="text-[15px] font-bold text-white/85">Звёздный фон приложения</p>
    </div>
  </div>
);
