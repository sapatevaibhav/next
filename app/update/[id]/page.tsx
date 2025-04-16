'use client'

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function updateArticlePage() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const pathname = usePathname()
  const id = pathname.split("/").pop()

  const handleUpdate = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body , id}),
      })

      if (!res.ok) throw new Error("Failed to create")

      const data = await res.json()
      router.push(`/read/${data.article.id}`)
    } catch (err) {
      console.error("Client error:", err)
      setError("Failed to update article.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Update Article</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Title</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Body</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-32"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Enter article content"
            required
          />
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Article"}
        </button>
      </div>
    </main>
  )
}
