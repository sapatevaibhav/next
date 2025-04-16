// This is a server component
import { draftMode } from "next/headers";
import { DraftAlertClient } from "./Client";

export async function DraftAlertWrapper() {
  // Server-side code - await the promise
  const { isEnabled } = await draftMode();

  // Only render the client component if draft mode is enabled
  if (!isEnabled) {
    return null;
  }

  return <DraftAlertClient />;
}
