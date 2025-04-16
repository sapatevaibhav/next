import { serverDrupal } from "@/lib/server-drupal"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest): Promise<Response> {
  const { id } = await request.json()

  if (!id) {
    return new Response("Missing article ID", { status: 400 })
  }

  try {
    await serverDrupal.deleteResource("node--article", id)
    return new Response("Article deleted successfully", { status: 200 })
  } catch (error) {
    console.error("Error deleting article:", error)
    return new Response("Error deleting article", { status: 500 })
  }
}
