import { serverDrupal } from "@/lib/server-drupal"
import { NextRequest, NextResponse } from "next/server"
import type { DrupalNode } from "next-drupal"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)

  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "9")
  const sort = (url.searchParams.get("sort") || "desc") as "asc" | "desc"
  const search = url.searchParams.get("search") || ""

  const debugResponse = await serverDrupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: {
        "fields[node--article]": "title,body",
        "page[limit]": 1,
      },
    }
  )
  console.log(
    "DEBUG - Article field structure:",
    JSON.stringify(debugResponse[0]?.body, null, 2)
  )

  try {
    const params: Record<string, any> = {
      "fields[node--article]": "title,body,field_image,uid,created",
      include: "field_image,uid",
      "page[limit]": limit,
      "page[offset]": (page - 1) * limit,
      sort: sort === "asc" ? "created" : "-created",
    }

    if (search) {
      params["filter[title][operator]"] = "CONTAINS"
      params["filter[title][value]"] = search
      params["filter[title][path]"] = "title"
      params["filter[title][group]"] = "or-group"

      params["filter[body][operator]"] = "CONTAINS"
      params["filter[body][value]"] = search
      params["filter[body][path]"] = "body.value"
      params["filter[body][group]"] = "or-group"

      params["filter[or-group][group][conjunction]"] = "OR"
      params["filter[or-group][group][memberOf]"] = "title,body"
    }

    console.log("Search params:", params)

    const response = await serverDrupal.getResourceCollection<DrupalNode[]>(
      "node--article",
      {
        params,
      }
    )

    const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
    const endpoint = "/jsonapi/node/article"

    const countParams = new URLSearchParams()

    if (search) {
      countParams.set("filter[title][operator]", "CONTAINS")
      countParams.set("filter[title][value]", search)
      countParams.set("filter[title][path]", "title")
      countParams.set("filter[title][group]", "or-group")

      countParams.set("filter[body][operator]", "CONTAINS")
      countParams.set("filter[body][value]", search)
      countParams.set("filter[body][path]", "body.value")
      countParams.set("filter[body][group]", "or-group")

      countParams.set("filter[or-group][group][conjunction]", "OR")
      countParams.set("filter[or-group][group][memberOf]", "title,body")
    }

    countParams.set("fields[node--article]", "id")

    const countUrl = `${baseUrl}${endpoint}?${countParams.toString()}`
    console.log("Count URL:", countUrl)

    const countResponse = await fetch(countUrl, {
      headers: {
        Accept: "application/vnd.api+json",
      },
    })

    const countData = await countResponse.json()
    console.log("Count response meta:", countData.meta)

    const total = countData.meta?.count || response.length
    const pageCount = Math.ceil(total / limit)

    return NextResponse.json({
      articles: response,
      total,
      pageCount,
    })
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return NextResponse.json(
      { error: "Error fetching articles", details: (error as Error).message },
      { status: 500 }
    )
  }
}
