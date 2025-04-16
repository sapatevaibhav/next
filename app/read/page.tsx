"use client"
import { drupal } from "@/lib/drupal"
import { DrupalNode } from "next-drupal"
import Link from "next/link"

export default async function ArticlePage() {
  const articles = await drupal.getResourceCollection<DrupalNode[]>("node--article", {
    params: {
      "fields[node--article]": "title,path,created",
      "sort": "-created",
    },
  })


  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Articles</h1>

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id} className="border p-4 rounded shadow">
              <Link href={article.path.alias || `/read/para/${article.id}`}>
                <h2 className="text-xl font-semibold hover:underline">{article.title}</h2>
              </Link>
              <p className="text-sm text-gray-500">Created on: {new Date(article.created).toLocaleDateString()}</p>

              <Link href={article.path.alias || `/update/${article.id}`}>
                <button >Update</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
