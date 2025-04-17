"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArticleCard } from "@/components/drupal/ArticleCard"
import { getArticlesCollection } from "@/lib/api/articles"
import { DrupalNode } from "next-drupal"
import { FaSort, FaSearch } from "react-icons/fa"

export default function ArticlesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [articles, setArticles] = useState<DrupalNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  const currentPage = Number(searchParams.get("page") || "1")
  const sortOrder = (searchParams.get("sort") || "desc") as "asc" | "desc"
  const searchQuery = searchParams.get("search") || ""

  const [searchInput, setSearchInput] = useState(searchQuery)

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true)
      try {
        const result = await getArticlesCollection({
          page: currentPage,
          sort: sortOrder,
          search: searchQuery,
        })

        setArticles(result.articles)
        setTotalPages(result.pageCount)
        setTotalItems(result.total)
      } catch (error) {
        console.error("Error loading articles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticles()
  }, [currentPage, sortOrder, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateQueryParams({ search: searchInput, page: 1 })
  }

  const toggleSort = () => {
    updateQueryParams({ sort: sortOrder === "asc" ? "desc" : "asc" })
  }

  const updateQueryParams = (params: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, String(value))
      } else {
        newParams.delete(key)
      }
    })

    router.push(`/articles?${newParams.toString()}`)
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    updateQueryParams({ page })
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Articles</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles..."
              className="pl-3 pr-10 py-2 border rounded-md w-full md:w-64"
            />
            <button
              type="submit"
              className="absolute right-3 top-2.5 text-gray-500"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>

          <button
            onClick={toggleSort}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            title={`Currently sorted ${sortOrder === "desc" ? "newest first" : "oldest first"}`}
          >
            <FaSort /> Sort by Date (
            {sortOrder === "desc" ? "Newest" : "Oldest"})
          </button>

          <Link
            href="/create"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-center"
          >
            Create Article
          </Link>
        </div>
      </div>

      {searchQuery && (
        <div className="mb-6">
          <p className="text-gray-600">
            {totalItems} result{totalItems !== 1 ? "s" : ""} found for "
            {searchQuery}"
            <button
              onClick={() => updateQueryParams({ search: "", page: 1 })}
              className="ml-2 text-blue-600 hover:underline"
            >
              Clear search
            </button>
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles?.length ? (
              articles.map((node) => (
                <div
                  key={node.id}
                  className="border rounded-lg overflow-hidden shadow-md"
                >
                  <ArticleCard node={node} />
                  <div className="p-4 flex justify-between bg-gray-50">
                    <Link
                      href={`/articles/${node.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Read More
                    </Link>
                    <Link
                      href={`/update/${node.id}`}
                      className="text-amber-600 hover:underline"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600 py-10">
                {searchQuery
                  ? "No articles match your search. Please try different keywords."
                  : "No articles found. Create your first article to get started."}
              </p>
            )}
          </div>

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav
                className="flex items-center space-x-2"
                aria-label="Pagination"
              >
                {/* Previous button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1

                  // Show first, last, and pages around current page
                  const shouldShow =
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    Math.abs(pageNumber - currentPage) <= 1

                  if (shouldShow) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-1 rounded ${
                          pageNumber === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    )
                  } else if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 &&
                      currentPage < totalPages - 2)
                  ) {
                    // Show ellipsis for skipped pages
                    return (
                      <span key={`ellipsis-${pageNumber}`} className="px-1">
                        ...
                      </span>
                    )
                  }

                  return null
                })}

                {/* Next button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <div className="text-center text-gray-600 mt-4">
              Page {currentPage} of {totalPages}
              <span className="ml-2">({totalItems} total articles)</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
