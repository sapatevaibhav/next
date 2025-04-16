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
    const params: Record<string, any> = {
      "fields[node--article]": "title,body,field_image,uid,created",
      include: "field_image,uid",
      "page[limit]": limit,
      "page[offset]": (page - 1) * limit,
      sort: sort === "asc" ? "created" : "-created",
    }

    if (search) {
      params["filter[title-body-combine][group][conjunction]"] = "OR"
      params[
        "filter[title-body-combine][group][membership][title][condition][path]"
      ] = "title"
      params[
        "filter[title-body-combine][group][membership][title][condition][operator]"
      ] = "CONTAINS"
      params[
        "filter[title-body-combine][group][membership][title][condition][value]"
      ] = search
      params[
        "filter[title-body-combine][group][membership][body][condition][path]"
      ] = "body.value"
      params[
        "filter[title-body-combine][group][membership][body][condition][operator]"
      ] = "CONTAINS"
      params[
        "filter[title-body-combine][group][membership][body][condition][value]"
      ] = search
    }

    const apiUrl = `/api/articles?page=${page}&limit=${limit}&sort=${sort}${search ? `&search=${encodeURIComponent(search)}` : ""}`
    const response = await fetch(apiUrl)
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
