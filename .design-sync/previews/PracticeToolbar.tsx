import { PracticeToolbar } from "web";

const noop = () => {};

export const WithHelp = () => (
  <div style={{ width: 560 }}>
    <PracticeToolbar progressLabel="Задание 3 из 10" onOpenHelp={noop} />
  </div>
);

export const ProgressOnly = () => (
  <div style={{ width: 560 }}>
    <PracticeToolbar progressLabel="Задание 1 из 5" />
  </div>
);
