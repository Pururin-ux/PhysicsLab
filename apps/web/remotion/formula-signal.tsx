import { AbsoluteFill, Composition, registerRoot } from "remotion";
import { FormulaSignalFilm } from "../components/landing/remotion/FormulaSignalFilm";

type FixedSignalProps = {
  activeIndex: number;
  completed?: boolean;
};

function FixedSignal({ activeIndex, completed = false }: FixedSignalProps) {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 46%, rgba(19, 77, 92, 0.22), transparent 42%), linear-gradient(145deg, #08101c, #0b1422 58%, #111925)",
      }}
    >
      <FormulaSignalFilm
        activeIndex={activeIndex}
        correctCount={completed ? 4 : 0}
        completed={completed}
        reducedMotion={false}
      />
    </AbsoluteFill>
  );
}

const FormulaSignalStep0 = () => <FixedSignal activeIndex={0} />;
const FormulaSignalStep1 = () => <FixedSignal activeIndex={1} />;
const FormulaSignalStep2 = () => <FixedSignal activeIndex={2} />;
const FormulaSignalStep3 = () => <FixedSignal activeIndex={3} />;
const FormulaSignalComplete = () => <FixedSignal activeIndex={3} completed />;

function RemotionRoot() {
  return (
    <>
      <Composition id="FormulaSignalStep0" component={FormulaSignalStep0} durationInFrames={180} fps={30} width={720} height={420} />
      <Composition id="FormulaSignalStep1" component={FormulaSignalStep1} durationInFrames={180} fps={30} width={720} height={420} />
      <Composition id="FormulaSignalStep2" component={FormulaSignalStep2} durationInFrames={180} fps={30} width={720} height={420} />
      <Composition id="FormulaSignalStep3" component={FormulaSignalStep3} durationInFrames={180} fps={30} width={720} height={420} />
      <Composition id="FormulaSignalComplete" component={FormulaSignalComplete} durationInFrames={180} fps={30} width={720} height={420} />
    </>
  );
}

registerRoot(RemotionRoot);
