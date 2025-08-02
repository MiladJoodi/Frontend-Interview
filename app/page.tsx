"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Difficulty = "easy" | "medium" | "hard"

interface Question {
  id: string
  question: string
  answer: string
  difficulty: Difficulty
  category: string
}

const categories = [
  { id: "all", name: "All", count: 0 },
  { id: "react", name: "React.js", count: 0 },
  { id: "nextjs", name: "Next.js", count: 0 },
  { id: "tailwind", name: "TailwindCSS", count: 0 },
  { id: "css", name: "CSS", count: 0 },
  { id: "html", name: "HTML", count: 0 },
  { id: "javascript", name: "JavaScript", count: 0 },
  { id: "typescript", name: "TypeScript", count: 0 },
  { id: "sass", name: "Sass", count: 0 },
  { id: "regex", name: "Regex", count: 0 },
  { id: "prisma", name: "Prisma ORM", count: 0 },
  { id: "drizzle", name: "Drizzle ORM", count: 0 },
  { id: "backend", name: "Backend", count: 0 },
  { id: "nodejs", name: "Node.js", count: 0 },
  { id: "express", name: "Express", count: 0 },
]

const ITEMS_PER_PAGE = 8

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
        setQuestions(data)
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
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Update categories count
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: cat.id === "all" ? questions.length : questions.filter((q) => q.category === cat.id).length,
  }))

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frontend Interview Q&A
            </h1>
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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 backdrop-blur-sm border-gray-200"
            />
          </div>
          <div className="sm:w-64">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="cursor-pointer bg-white/70 backdrop-blur-sm border-gray-200">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesWithCount.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center mb-6 text-sm text-muted-foreground">
          <div>
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredQuestions.length)} of{" "}
            {filteredQuestions.length} questions
          </div>
          <div>
            Page {currentPage} of {totalPages}
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
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 font-medium min-w-[2rem]">#{questionNumber}</span>
                        <span className="font-medium text-left">{item.question}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 ml-4">
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {getDifficultyText(item.difficulty)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
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
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="cursor-pointer bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
            >
              <ChevronLeft className="h-4 w-4 cursor-pointer" />
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`cursor-pointer min-w-[40px] ${
                    currentPage === page
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="cursor-pointer bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
            >
              Next
              <ChevronRight className="h-4 w-4 cursor-pointer" />
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>Made with ❤️ for the developer community</p>
          <div className="flex justify-center items-center gap-4 mt-2">
            <a
              href="https://github.com/MiladJoodi/Frontend-Interview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="h-3 w-3 cursor-pointer" />
              Contribute on GitHub
            </a>
            <span className="text-gray-300">•</span>
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
