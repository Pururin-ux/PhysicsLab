import { OptionItem } from "web";

const noop = () => {};

export const Idle = () => (
  <div style={{ width: 560 }}>
    <OptionItem id="a" text="6,5 м/с²" state="idle" disabled={false} onClick={noop} />
  </div>
);

export const CorrectState = () => (
  <div style={{ width: 560 }}>
    <OptionItem id="d" text="12 м/с²" state="correct" disabled onClick={noop} />
  </div>
);

export const WrongState = () => (
  <div style={{ width: 560 }}>
    <OptionItem id="b" text="13 м/с²" state="wrong" disabled onClick={noop} />
  </div>
);

export const Dimmed = () => (
  <div style={{ width: 560 }}>
    <OptionItem id="c" text="7 м/с²" state="dimmed" disabled onClick={noop} />
  </div>
);
