import type { Metadata } from "next"
import ArticlesPage from "./articles/page"

export const metadata: Metadata = {
  description: "A Next.js site powered by a Drupal backend.",
}

export default async function Home() {
  return (
    <>
      <ArticlesPage />
    </>
  )
}
