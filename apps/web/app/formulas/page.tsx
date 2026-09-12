import { Suspense } from "react";
import { getFormulaReferenceView } from "../../lib/learning/learning-links";
import { FormulasEditorialBrowser } from "./FormulasEditorialBrowser";
import styles from "./formulas.module.css";

export const metadata = {
  title: "Формулы | PhysicsLab",
};

export default function FormulasPage() {
  return (
    <Suspense
      fallback={(
        <div role="status" aria-label="Формулы загружаются" className={styles.loading}>
          <span />
          <span />
          <span />
        </div>
      )}
    >
      <FormulasEditorialBrowser groups={getFormulaReferenceView()} />
    </Suspense>
  );
}
