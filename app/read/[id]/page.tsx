import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import { DrupalNode } from "next-drupal"

interface Props {
  params: {
    id: string
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const article = await drupal.getResource<DrupalNode>("node--article", params.id, {
    params: {
      "fields[node--article]": "title,body,created",
    },
  })

  if (!article) {
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Published on: {new Date(article.created).toLocaleDateString()}
      </p>
      <div
        className="prose max-w-none prose-lg text-gray-800"
        dangerouslySetInnerHTML={{ __html: article.body?.processed || "" }}
      />
    </main>
  )
}
