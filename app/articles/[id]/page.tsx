import React from "react"
import { serverDrupal } from "@/lib/server-drupal"
import { ArticleCard } from "@/components/drupal/ArticleCard"
import { DrupalNode } from "next-drupal"
import { notFound } from "next/navigation"

interface Params {
  params: {
    id: string
  }
}

export default async function ArticlePage({ params }: Params) {
  const id = params.id

  try {
    const article = await serverDrupal.getResource<DrupalNode>("node--article", id, {
      params: {
        "fields[node--article]": "title,body,field_image,uid,created",
        include: "field_image,uid",
      },
    })

    if (!article) {
      return notFound()
    }

    return (
      <div className="container mx-auto py-10">
        <article>
          <h1 className="mb-4 text-3xl font-bold">{article.title}</h1>
          <div className="mb-4 border rounded-lg overflow-hidden shadow-md">
            <ArticleCard node={article} />
            <div className="p-6">
              <div
                dangerouslySetInnerHTML={{ __html: article.body.processed }}
              />
            </div>
          </div>
        </article>
      </div>
    )
  } catch (error) {
    console.error("Error fetching article:", error)
    return notFound()
  }
}
