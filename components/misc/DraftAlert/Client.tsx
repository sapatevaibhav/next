"use client";

// Client-side component
export function DraftAlertClient() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-300 text-yellow-900 p-4 text-center z-50">
      <p className="font-medium">
        You are viewing the site in draft mode.{" "}
        <a
          href="/api/disable-draft"
          className="underline font-bold"
        >
          Exit draft mode
        </a>
      </p>
    </div>
  );
}
