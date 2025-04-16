// app/art-next/[id]/page.tsx
import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import { log } from "node:console"


interface Props {
    params: {
      id: string
    }
  }

export default async function ArticlePage({ params }: Props) {
  const article = await drupal.getResource("node--article", params.id, {
    params: {
      "include": "field_para", 
    },
  }

)
console.log(article);


  if (!article) return notFound()

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {article.field_para?.map((para: any) => {
        switch (para.type) {
          case "paragraph--text_block":
            return (
              <div key={para.id} className="mb-4">
                <h2 className="text-xl font-semibold">{para.field_heading}</h2>
                <p>{para.field_body}</p>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
