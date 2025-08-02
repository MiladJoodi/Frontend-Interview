"use client"

import { useState, useMemo } from "react"
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

const questions: Question[] = [
  // All Category
  {
    id: "1",
    category: "all",
    difficulty: "easy",
    question: "What is the difference between let, const, and var in JavaScript?",
    answer:
      "var is function-scoped and can be redeclared and updated. let is block-scoped and can be updated but not redeclared. const is block-scoped and cannot be updated or redeclared after initialization. var also has hoisting behavior that can lead to unexpected results, while let and const have temporal dead zones.",
  },

  // React.js
  {
    id: "2",
    category: "react",
    difficulty: "medium",
    question: "What is the Virtual DOM and how does it work in React?",
    answer:
      "The Virtual DOM is a JavaScript representation of the actual DOM. React creates a virtual copy of the DOM in memory, and when state changes occur, it creates a new virtual DOM tree. React then compares (diffs) the new tree with the previous one and updates only the parts of the real DOM that have changed. This process is called reconciliation and makes React applications faster.",
  },
  {
    id: "3",
    category: "react",
    difficulty: "easy",
    question: "What are React Hooks and why were they introduced?",
    answer:
      "React Hooks are functions that let you use state and other React features in functional components. They were introduced to solve problems like wrapper hell, huge components, and confusing classes. Common hooks include useState for state management, useEffect for side effects, useContext for consuming context, and useCallback/useMemo for performance optimization.",
  },
  {
    id: "4",
    category: "react",
    difficulty: "hard",
    question: "What is the difference between useCallback and useMemo?",
    answer:
      "useCallback is used to memoize functions to prevent unnecessary re-renders. useMemo is used to memoize the result of expensive calculations. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). useCallback returns the memoized function, while useMemo returns the memoized value.",
  },

  // Next.js
  {
    id: "5",
    category: "nextjs",
    difficulty: "medium",
    question: "What is the difference between SSR, SSG, and CSR in Next.js?",
    answer:
      "SSR (Server-Side Rendering): Page is rendered on the server for each request. SSG (Static Site Generation): Page is generated at build time. CSR (Client-Side Rendering): Page is rendered in the browser. Next.js supports all three methods, and you can choose the best one for each page based on your needs.",
  },
  {
    id: "6",
    category: "nextjs",
    difficulty: "easy",
    question: "What is the difference between App Router and Pages Router in Next.js?",
    answer:
      "App Router is the new routing system in Next.js 13+ that uses React Server Components and is located in the app directory. Pages Router is the traditional routing system located in the pages directory. App Router provides better performance, more flexibility, and improved developer experience.",
  },

  // TailwindCSS
  {
    id: "7",
    category: "tailwind",
    difficulty: "easy",
    question: "What are the advantages of using TailwindCSS?",
    answer:
      "TailwindCSS is a utility-first CSS framework. Advantages include: faster development, smaller file sizes, design consistency, no need to write custom CSS, easy responsive design, high customization, and better maintainability. It promotes a component-based approach to styling.",
  },
  {
    id: "8",
    category: "tailwind",
    difficulty: "medium",
    question: "How do you create custom classes in TailwindCSS?",
    answer:
      "You can create custom classes using @apply directive in CSS, define custom classes in tailwind.config.js, use arbitrary values like w-[32px], or write plugins. The @apply directive is most common: @apply flex items-center justify-center;",
  },

  // CSS
  {
    id: "9",
    category: "css",
    difficulty: "medium",
    question: "What is the difference between Flexbox and CSS Grid?",
    answer:
      "Flexbox is designed for one-dimensional layouts (either row or column). CSS Grid is designed for two-dimensional layouts (rows and columns simultaneously). Grid is better for page-level layouts, while Flexbox is better for component-level layouts and when items need to grow/shrink dynamically.",
  },
  {
    id: "10",
    category: "css",
    difficulty: "easy",
    question: "What are the different ways to center an element in CSS?",
    answer:
      "Several methods: 1) Flexbox: display: flex; justify-content: center; align-items: center; 2) Grid: display: grid; place-items: center; 3) Absolute positioning: position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 4) Margin auto for horizontal: margin: 0 auto; 5) Text-align: center for inline elements.",
  },

  // HTML
  {
    id: "11",
    category: "html",
    difficulty: "easy",
    question: "What is the difference between semantic and non-semantic HTML elements?",
    answer:
      "Semantic elements like header, nav, main, article clearly describe their meaning and content to both browsers and developers. Non-semantic elements like div and span don't provide information about their content. Semantic HTML improves SEO, accessibility, and code maintainability.",
  },
  {
    id: "12",
    category: "html",
    difficulty: "medium",
    question: "What are the new features introduced in HTML5?",
    answer:
      "HTML5 introduced semantic elements (header, nav, section), Canvas API, Local Storage, Geolocation API, Video/Audio elements, Form validation, Web Workers, WebSocket, Drag and Drop API, and many other features that enhanced web development capabilities.",
  },

  // JavaScript
  {
    id: "13",
    category: "javascript",
    difficulty: "hard",
    question: "Explain the concept of closures in JavaScript",
    answer:
      "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created. They're useful for data privacy, creating function factories, and maintaining state in asynchronous operations.",
  },
  {
    id: "14",
    category: "javascript",
    difficulty: "medium",
    question: "What is the difference between == and === in JavaScript?",
    answer:
      "== (loose equality) performs type coercion before comparison, meaning it converts operands to the same type before comparing. === (strict equality) compares both value and type without any conversion. For example: '5' == 5 is true, but '5' === 5 is false. It's generally recommended to use === to avoid unexpected behavior.",
  },

  // TypeScript
  {
    id: "15",
    category: "typescript",
    difficulty: "medium",
    question: "What are the advantages of using TypeScript?",
    answer:
      "TypeScript provides static type checking, better IntelliSense, early error detection at compile time, easier refactoring, improved code readability, better documentation, and support for modern ES6+ features. It helps catch bugs before runtime and improves developer productivity.",
  },
  {
    id: "16",
    category: "typescript",
    difficulty: "hard",
    question: "How do Generic Types work in TypeScript?",
    answer:
      "Generics allow you to create reusable components that work with multiple types. They're defined with <T> syntax and the type is specified when used. Example: function identity<T>(arg: T): T { return arg; }. Generics provide type safety while maintaining flexibility.",
  },

  // Sass
  {
    id: "17",
    category: "sass",
    difficulty: "easy",
    question: "What are the advantages of using Sass?",
    answer:
      "Sass provides variables, nesting, mixins, functions, partials, inheritance, and mathematical operations. It makes CSS more organized, maintainable, and DRY (Don't Repeat Yourself). Sass helps write cleaner and more efficient stylesheets.",
  },
  {
    id: "18",
    category: "sass",
    difficulty: "medium",
    question: "What is the difference between Sass and SCSS?",
    answer:
      "Sass has two syntaxes: Sass (indented syntax) uses indentation and no braces/semicolons, while SCSS (Sassy CSS) uses braces and semicolons like regular CSS but with additional features. SCSS is more popular because it's closer to CSS syntax.",
  },

  // Regex
  {
    id: "19",
    category: "regex",
    difficulty: "medium",
    question: "What is Regex and what are its common use cases?",
    answer:
      "Regular Expression (Regex) is a pattern used to match character combinations in strings. Common use cases include: form validation (email, phone), search and replace operations, data parsing, input sanitization, and text processing. In JavaScript, it's used with /pattern/flags or new RegExp().",
  },
  {
    id: "20",
    category: "regex",
    difficulty: "hard",
    question: "What are Lookahead and Lookbehind in Regex?",
    answer:
      "Lookahead (?=pattern) and Negative Lookahead (?!pattern) check if a pattern exists or doesn't exist after the current position without including it in the match. Lookbehind (?<=pattern) and Negative Lookbehind (?<!pattern) check patterns before the current position. They're useful for complex pattern matching.",
  },

  // Prisma ORM
  {
    id: "21",
    category: "prisma",
    difficulty: "medium",
    question: "What is Prisma ORM and what are its advantages?",
    answer:
      "Prisma is a modern ORM for Node.js and TypeScript. Advantages include: Type-safe database access, auto-generated client, database migrations, introspection, multi-database support, excellent developer experience, and powerful query capabilities with intuitive API.",
  },
  {
    id: "22",
    category: "prisma",
    difficulty: "hard",
    question: "How does Prisma Schema work?",
    answer:
      "Prisma Schema is defined in schema.prisma file and includes data model, database connection, and generator configuration. With 'prisma generate', the client is generated, and with 'prisma migrate', the database is synchronized. The schema serves as the single source of truth for your database structure.",
  },

  // Drizzle ORM
  {
    id: "23",
    category: "drizzle",
    difficulty: "medium",
    question: "What is Drizzle ORM and how does it differ from Prisma?",
    answer:
      "Drizzle is a lightweight TypeScript ORM with SQL-like syntax. Differences from Prisma: lighter weight, closer to SQL, no code generation, better performance, smaller learning curve, and more direct database interaction while maintaining type safety.",
  },
  {
    id: "24",
    category: "drizzle",
    difficulty: "hard",
    question: "How does Query building work in Drizzle?",
    answer:
      "Drizzle uses a chainable API similar to SQL: db.select().from(users).where(eq(users.id, 1)). It's SQL-like but type-safe. Relations are supported with relational queries and joins. The API is intuitive for developers familiar with SQL.",
  },

  // Backend
  {
    id: "25",
    category: "backend",
    difficulty: "easy",
    question: "What is the difference between REST and GraphQL?",
    answer:
      "REST uses HTTP methods and multiple endpoints for different resources. GraphQL uses a single endpoint where clients request exactly the data they need. GraphQL solves over-fetching and under-fetching problems but has a steeper learning curve and more complexity.",
  },
  {
    id: "26",
    category: "backend",
    difficulty: "medium",
    question: "What is the difference between Authentication and Authorization?",
    answer:
      "Authentication verifies who the user is (identity verification). Authorization determines what the user can do (permission verification). Authentication typically happens first, followed by authorization. Example: login is authentication, accessing admin panel is authorization.",
  },

  // Node.js
  {
    id: "27",
    category: "nodejs",
    difficulty: "medium",
    question: "How does the Event Loop work in Node.js?",
    answer:
      "The Event Loop is Node.js's main mechanism for handling asynchronous operations. It has different phases: Timer, Pending callbacks, Poll, Check, Close callbacks. It enables non-blocking I/O operations by offloading operations to the system kernel whenever possible.",
  },
  {
    id: "28",
    category: "nodejs",
    difficulty: "hard",
    question: "What is the difference between process.nextTick and setImmediate?",
    answer:
      "process.nextTick executes at the beginning of each phase and has higher priority. setImmediate executes in the check phase. nextTick can potentially block the event loop if used excessively, while setImmediate is more predictable and safer for recursive calls.",
  },

  // Express
  {
    id: "29",
    category: "express",
    difficulty: "easy",
    question: "What is Middleware in Express?",
    answer:
      "Middleware are functions that execute during the request-response cycle. They have access to req, res, and next objects. Common uses include: authentication, logging, parsing request bodies, error handling, and CORS. Middleware can modify request/response objects or end the cycle.",
  },
  {
    id: "30",
    category: "express",
    difficulty: "medium",
    question: "How does Error Handling work in Express?",
    answer:
      "Express uses error-handling middleware with 4 parameters: (err, req, res, next). It should be defined last in the middleware stack. Errors can be passed to error handlers using next(error). Express has a default error handler, but custom ones provide better control.",
  },
]

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredQuestions = useMemo(() => {
    const filtered = questions.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    return filtered
  }, [searchTerm, selectedCategory])

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl font-bold tracking-tight">Frontend Interview Q&A</h1>
            <div style={{ marginLeft: "15px" }} className="flex items-center">
              <iframe
                src="https://ghbtns.com/github-btn.html?user=MiladJoodi&repo=Frontend-Interview&type=star&count=true&size=large"
                scrolling="0"
                width="120"
                height="30"
                title="GitHub"
                style={{ border: "none", background: "transparent" }}
                className="sm:w-[170px] w-[120px]"
              />
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Common frontend development interview questions and answers to help you prepare
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="sm:w-64">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="cursor-pointer">
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
                  className="border rounded-lg px-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {questionNumber}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(item.difficulty)}>
                            {getDifficultyText(item.difficulty)}
                          </Badge>
                        </div>
                        <span className="font-medium text-left">{item.question}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    <div className="ml-11 text-muted-foreground leading-relaxed text-left">{item.answer}</div>
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
              className="cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="cursor-pointer min-w-[40px]"
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
              className="cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4" />
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
              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Contribute on GitHub
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="https://www.linkedin.com/in/joodi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
