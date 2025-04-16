"use client";

import { useSession } from "next-auth/react";

export function SessionTest() {
  const { data: session, status } = useSession();

  return (
    <div className="p-4 m-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold">Session Status: {status}</h2>
      {session ? (
        <pre className="mt-2 p-2 bg-white rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      ) : (
        <p className="mt-2">No active session</p>
      )}
    </div>
  );
}
