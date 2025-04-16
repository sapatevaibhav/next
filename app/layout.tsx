"use client"

import { SessionProvider } from "next-auth/react"
import { DraftAlert } from "@/components/misc/DraftAlert"
import { HeaderNav } from "@/components/navigation/HeaderNav"
import { Metadata } from "next"
import { ClientLayout } from "@/components/layout/ClientLayout"
import type { ReactNode } from "react"

import "@/styles/globals.css"

// export const metadata: Metadata = {
//   title: {
//     default: "Next.js for Drupal",
//     template: "%s | Next.js for Drupal",
//   },
//   description: "Enterprise-grade Next.js React framework with Drupal",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ClientLayout>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
