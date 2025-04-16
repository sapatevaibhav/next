import type { DrupalNode } from "next-drupal"

interface GetArticlesOptions {
  page?: number
  limit?: number
  sort?: "asc" | "desc"
  search?: string
}

export async function getArticlesCollection({
  page = 1,
  limit = 9,
  sort = "desc",
  search = "",
}: GetArticlesOptions = {}): Promise<{
  articles: DrupalNode[]
  total: number
  pageCount: number
}> {
  try {
    const apiUrl = `/api/articles?page=${page}&limit=${limit}&sort=${sort}${search ? `&search=${encodeURIComponent(search)}` : ""}`
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      articles: data.articles,
      total: data.total,
      pageCount: data.pageCount,
    }
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return { articles: [], total: 0, pageCount: 0 }
  }
}

export async function createArticle(title: string, body: string) {
  try {
    const response = await fetch("/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    })

    if (!response.ok) throw new Error("Failed to create article")
    return await response.json()
  } catch (error) {
    console.error("Failed to create article:", error)
    throw error
  }
}

export async function updateArticle(id: string, title: string, body: string) {
  try {
    const response = await fetch("/api/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, title, body }),
    })

    if (!response.ok) throw new Error("Failed to update article")
    return await response.json()
  } catch (error) {
    console.error("Failed to update article:", error)
    throw error
  }
}
