import { ProgressDots } from "web";

export const SessionStart = () => <ProgressDots total={10} currentStep={1} completed={0} />;

export const MidSession = () => <ProgressDots total={10} currentStep={6} completed={5} />;

export const AlmostDone = () => <ProgressDots total={10} currentStep={10} completed={9} />;
