import { serverDrupal } from "@/lib/server-drupal"
import { NextResponse } from "next/server"
import { DrupalNode } from "next-drupal"


export async function POST(req: Request) {
  try {
    const { title, body, id } = await req.json()
    const article = await serverDrupal.updateResource<DrupalNode>("node--article", id ,{
        data: {
            attributes: {
            title,
            body: {
                value: body,
                format: "plain_text",
            },
            },
        },
    
    },
)

    return NextResponse.json({ article }, { status: 201 })
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json(
      { message: "Failed to update article.", error: error.message },
      { status: 500 }
    )
  }
}