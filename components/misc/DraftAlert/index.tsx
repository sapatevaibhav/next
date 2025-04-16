import { Suspense } from "react";
import { DraftAlertWrapper } from "./Wrapper";

export function DraftAlert() {
  return (
    <Suspense fallback={null}>
      <DraftAlertWrapper />
    </Suspense>
  );
}
