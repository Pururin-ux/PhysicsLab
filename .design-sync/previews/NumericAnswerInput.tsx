import { NumericAnswerInput } from "web";

const noop = () => {};

export const IntegerHint = () => (
  <div style={{ width: 560 }}>
    <NumericAnswerInput unit="м/с" decimals={0} sign="positive" disabled={false} onSubmit={noop} />
  </div>
);

export const DecimalHint = () => (
  <div style={{ width: 560 }}>
    <NumericAnswerInput unit="дптр" decimals={1} sign="positive" disabled={false} onSubmit={noop} />
  </div>
);

export const SubmittedCorrect = () => (
  <div style={{ width: 560 }}>
    <NumericAnswerInput
      unit="м"
      decimals={0}
      sign="positive"
      disabled
      submitted={{ raw: "125", isCorrect: true }}
      onSubmit={noop}
    />
  </div>
);

export const SubmittedWrong = () => (
  <div style={{ width: 560 }}>
    <NumericAnswerInput
      unit="м/с"
      decimals={0}
      sign="positive"
      disabled
      submitted={{ raw: "5", isCorrect: false }}
      onSubmit={noop}
    />
  </div>
);
