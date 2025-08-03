"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Difficulty = "easy" | "medium" | "hard"

// Define the Question interface
interface Question {
  id: string
  question: string
  answer: string
  difficulty: Difficulty
  category: string
}

// Define the categories array with display names and subcategories
const categories: { id: string; name: string; count: number; subcategories?: string[] }[] = [
  { id: "all", name: "All", count: 0 },
  { id: "react", name: "React.js", count: 0, subcategories: ["hooks", "components", "jsx"] },
  { id: "nextjs", name: "Next.js", count: 0 },
  { id: "tailwind", name: "TailwindCSS", count: 0 },
  { id: "css", name: "CSS", count: 0 },
  { id: "javascript", name: "JavaScript", count: 0, subcategories: ["closures", "prototypes", "es6"] },
  { id: "html", name: "HTML", count: 0 },
  { id: "typescript", name: "TypeScript", count: 0 },
  { id: "sass", name: "Sass", count: 0, subcategories: ["mixins", "variables"] },
  { id: "regex", name: "Regex", count: 0 },
  { id: "prisma", name: "Prisma ORM", count: 0 },
  { id: "drizzle", name: "Drizzle ORM", count: 0 },
  { id: "backend", name: "Backend", count: 0 },
  { id: "nodejs", name: "Node.js", count: 0 },
  { id: "express", name: "Express", count: 0 },
  { id: "other", name: "Other", count: 0 }, // Added "Other" category
]

const ITEMS_PER_PAGE = 8
const MAX_PAGINATION_BUTTONS = 5 // Max number of pagination buttons to show

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "hard":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getDifficultyText = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return "Easy"
    case "medium":
      return "Medium"
    case "hard":
      return "Hard"
    default:
      return "Unknown"
  }
}

// Helper function to capitalize the first letter of each word
const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Define the main component
export default function Component() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/data/questions.json")
        const data = await response.json()
        // Sort questions: first by category, then by question alphabetically
        const sortedData = data.sort((a: Question, b: Question) => {
          const categoryComparison = a.category.localeCompare(b.category)
          if (categoryComparison !== 0) {
            return categoryComparison
          }
          return a.question.localeCompare(b.question)
        })
        setQuestions(sortedData)
      } catch (error) {
        console.error("Error loading questions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [])

  const filteredQuestions = useMemo(() => {
    const filtered = questions.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    return filtered
  }, [searchTerm, selectedCategory, questions])

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE)
  
  // Ensure current page is valid when filtered results change
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages))
  
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Update current page if it's invalid
  useEffect(() => {
    if (currentPage !== validCurrentPage) {
      setCurrentPage(validCurrentPage)
    }
  }, [currentPage, validCurrentPage])

  // Update categories count
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: cat.id === "all" ? questions.length : questions.filter((q) => q.category === cat.id).length,
  }))

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
    // Reset search term when changing categories for better UX
    if (searchTerm) {
      setSearchTerm("")
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Improved logic to generate pagination buttons
  const getPaginationButtons = (): (number | string)[] => {
    const buttons: (number | string)[] = []
    
    // If total pages is 1 or less, don't show pagination
    if (totalPages <= 1) {
      return buttons
    }

    // Always show first page
    buttons.push(1)
    
    // Calculate the range of pages to show around current page
    const maxButtons = MAX_PAGINATION_BUTTONS - 2 // Reserve space for first and last page
    const halfButtons = Math.floor(maxButtons / 2)
    
    let startPage = Math.max(2, validCurrentPage - halfButtons)
    let endPage = Math.min(totalPages - 1, validCurrentPage + halfButtons)
    
    // Adjust if we're near the edges
    if (startPage === 2) {
      endPage = Math.min(totalPages - 1, startPage + maxButtons - 1)
    } else if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - maxButtons + 1)
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push("...")
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i)
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      buttons.push("...")
    }
    
    // Always show last page (if there is more than one page)
    if (totalPages > 1) {
      buttons.push(totalPages)
    }
    
    return buttons
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl pb-16">
        {" "}
        {/* Added pb-16 for spacing */}
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Frontend Interview Q&A</h1>{" "}
            {/* Changed title color */}
            <div style={{ marginLeft: "15px" }} className="flex items-center">
              <iframe
                src="https://ghbtns.com/github-btn.html?user=MiladJoodi&repo=Frontend-Interview&type=star&count=true&size=large"
                scrolling="0"
                width="120"
                height="30"
                title="GitHub"
                style={{ border: "none", background: "transparent" }}
                className="sm:w-[170px] w-[120px] cursor-pointer"
              />
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Common frontend development interview questions and answers to help you prepare
          </p>
          <div className="bg-white/70 backdrop-blur-sm border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto shadow-sm">
            <p className="text-sm text-blue-800">
              💡 <strong>Note:</strong> These questions are designed for initial preparation and interview readiness.
              For deeper study and more detailed explanations, use specialized resources and tools like ChatGPT for
              comprehensive learning.
            </p>
          </div>
        </div>
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 backdrop-blur-sm border-gray-200 w-full"
            />
          </div>
        </div>
        {/* Horizontal Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
          {categoriesWithCount.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              className={`cursor-pointer px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? "bg-gray-900 text-white hover:bg-gray-800" // Active style
                  : "bg-white/70 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-gray-100" // Inactive style
              }`}
            >
              #{capitalizeWords(category.name)} ({category.count})
            </Badge>
          ))}
        </div>
        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 text-sm text-muted-foreground gap-2">
          <div className="text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredQuestions.length)} of{" "}
            {filteredQuestions.length} questions
          </div>
          <div className="text-center sm:text-right">
            Page {validCurrentPage} of {totalPages}
          </div>
        </div>
        {/* Questions */}
        {paginatedQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No questions found matching your search.</p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {paginatedQuestions.map((item, index) => {
              const questionNumber = startIndex + index + 1
              return (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border rounded-lg px-4 hover:shadow-md transition-all duration-200 cursor-pointer bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-sm text-gray-400 font-medium min-w-[2rem] flex-shrink-0">#{questionNumber}</span>
                        <span className="font-medium text-left leading-relaxed">{item.question}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-11 sm:ml-4 flex-shrink-0">
                        <Badge className={`text-[0.65rem] px-1 py-0.5 ${getDifficultyColor(item.difficulty)}`}>
                          {" "}
                          {/* Smaller difficulty badge */}
                          {getDifficultyText(item.difficulty)}
                        </Badge>{" "}
                        <Badge variant="outline" className="text-xs">
                          {capitalizeWords(item.category)} {/* Capitalized category */}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    <div className="ml-8 text-muted-foreground leading-relaxed text-left">{item.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(validCurrentPage - 1)}
                disabled={validCurrentPage === 1}
                className="cursor-pointer bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
              >
                <ChevronLeft className="h-4 w-4 cursor-pointer" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex gap-1">
                {getPaginationButtons().map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="px-2 py-1 text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={validCurrentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className={`cursor-pointer min-w-[35px] sm:min-w-[40px] text-xs sm:text-sm ${
                        validCurrentPage === page
                          ? "bg-gray-900 text-white hover:bg-gray-800" // Simple dark active style
                          : "bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
                      }`}
                    >
                      {page}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(validCurrentPage + 1)}
                disabled={validCurrentPage === totalPages}
                className="cursor-pointer bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 cursor-pointer" />
              </Button>
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>Made with ❤️ for the developer community</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-2">
            <a
              href="https://github.com/MiladJoodi/Frontend-Interview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="h-3 w-3 cursor-pointer" />
              Contribute on GitHub
            </a>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <a
              href="https://www.linkedin.com/in/joodi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="h-3 w-3 cursor-pointer" />
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
