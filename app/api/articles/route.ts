import { serverDrupal } from "@/lib/server-drupal"
import { NextRequest, NextResponse } from "next/server"
import type { DrupalNode } from "next-drupal"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)

  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "9")
  const sort = (url.searchParams.get("sort") || "desc") as "asc" | "desc"
  const search = url.searchParams.get("search") || ""

  try {
    if (!search) {
      const params: Record<string, any> = {
        "fields[node--article]": "title,body,field_image,uid,created",
        include: "field_image,uid",
        "page[limit]": limit,
        "page[offset]": (page - 1) * limit,
        sort: sort === "asc" ? "created" : "-created",
      }

      const response = await serverDrupal.getResourceCollection<DrupalNode[]>(
        "node--article",
        {
          params,
        }
      )

      const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
      const endpoint = "/jsonapi/node/article"
      const countParams = new URLSearchParams()
      countParams.set("fields[node--article]", "id")
      const countUrl = `${baseUrl}${endpoint}?${countParams.toString()}`
      const countResponse = await fetch(countUrl, {
        headers: {
          Accept: "application/vnd.api+json",
        },
      })
      const countData = await countResponse.json()
      const total = countData.meta?.count || response.length
      const pageCount = Math.ceil(total / limit)

      return NextResponse.json({
        articles: response,
        total,
        pageCount,
      })
    } else {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
        const indexName = "default_index"
        const searchApiUrl = `${baseUrl}/jsonapi/index/${indexName}/search`

        console.log("Attempting Search API with index:", indexName)

        const requestBody = {
          query: search,
          page: {
            limit: limit,
            offset: (page - 1) * limit,
          },
        }

        console.log("Search API Request:", {
          url: searchApiUrl,
          body: JSON.stringify(requestBody),
        })

        const searchResponse = await fetch(searchApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
          },
          body: JSON.stringify(requestBody),
        })

        if (!searchResponse.ok) {
          const errorText = await searchResponse.text()
          throw new Error(
            `Search API error: ${searchResponse.status} - ${errorText}`
          )
        }

        const searchData = await searchResponse.json()
        console.log("Search API response structure:", Object.keys(searchData))

        const total = searchData.meta?.count || searchData.data?.length || 0
        const pageCount = Math.ceil(total / limit)

        return NextResponse.json({
          articles: searchData.data || [],
          total,
          pageCount,
        })
      } catch (searchError) {
        console.error("Search API specific error:", searchError)

        console.log(
          "Falling back to JSON:API filtering with multiple conditions"
        )

        const params: Record<string, any> = {
          "fields[node--article]": "title,body,field_image,uid,created",
          include: "field_image,uid",
          "page[limit]": limit,
          "page[offset]": (page - 1) * limit,
          sort: sort === "asc" ? "created" : "-created",

          "filter[or-group][group][conjunction]": "OR",

          "filter[title][condition][path]": "title",
          "filter[title][condition][operator]": "CONTAINS",
          "filter[title][condition][value]": search,
          "filter[title][condition][memberOf]": "or-group",

          "filter[body][condition][path]": "body.value",
          "filter[body][condition][operator]": "CONTAINS",
          "filter[body][condition][value]": search,
          "filter[body][condition][memberOf]": "or-group",
        }

        const response = await serverDrupal.getResourceCollection<DrupalNode[]>(
          "node--article",
          {
            params,
          }
        )

        const total = response.length
        const pageCount = Math.ceil(total / limit)

        return NextResponse.json({
          articles: response,
          total,
          pageCount,
        })
      }
    }
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return NextResponse.json(
      { error: "Error fetching articles", details: (error as Error).message },
      { status: 500 }
    )
  }
}
