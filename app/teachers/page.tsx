import { drupal } from "@/lib/drupal"
import { JsonApiResource } from "next-drupal"
import { Key } from "react"

interface TeacherViewItem extends JsonApiResource {
  title?: string
  label?: string
  field_teacher_name?: string
}

export const dynamic = "force-dynamic"

export default async function TeachersPage() {
  const view = await drupal.getView<TeacherViewItem>("teachers_list--page_1")

  const teachers = view?.results ?? []

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Teachers List</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map(
          (teacher: {
            id: Key
            title: any
            label: any
            field_teacher_name: string
          }) => (
            <li
              key={teacher.id}
              className="border rounded-xl shadow p-4 space-y-2"
            >
              <h2 className="text-xl font-semibold">
                {teacher.title || teacher.label || "No Title"}
              </h2>
              {teacher.field_teacher_name && (
                <p className="text-gray-600">
                  Name: {teacher.field_teacher_name}
                </p>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  )
}
