"use client"

import Link from "next/link"
import Image from "next/image"
import { absoluteUrl, formatDate } from "@/lib/utils"
import type { DrupalNode } from "next-drupal"
import { useRouter } from "next/navigation"

interface ArticleCardProps {
  node: DrupalNode
}

export function ArticleCard({ node }: ArticleCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: node.id }),
      })
      if (res.ok) {
        router.refresh?.()
      } else {
        alert("Failed to delete article")
      }
    } catch (err) {
      alert("Error deleting article")
    }
  }

  const getImageUrl = () => {
    if (node.field_image?.uri?.url) {
      return absoluteUrl(node.field_image.uri.url)
    }

    return "/images/placeholder.jpg"
  }

  const getImageAlt = () => {
    return node.field_image?.resourceIdObjMeta?.alt || node.title || ""
  }

  const hasValidImage = Boolean(node.field_image?.uri?.url)

  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
      {hasValidImage ? (
        <div className="relative h-48">
          <Image
            src={getImageUrl()}
            alt={getImageAlt()}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      )}
      <div className="flex flex-col justify-between flex-1 p-6 bg-white">
        <div className="flex-1">
          <Link href={`/articles/${node.id}`} className="block mt-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {node.title}
            </h3>
            {node.body?.summary && (
              <p className="mt-3 text-base text-gray-500">
                {node.body.summary}
              </p>
            )}
          </Link>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {node.uid?.display_name || "Anonymous"}
              </p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={node.created}>{formatDate(node.created)}</time>
              </div>
            </div>
          </div>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            aria-label="Delete article"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
