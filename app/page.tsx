"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const frontendQuestions = [
  {
    id: "1",
    question: "What is the difference between let, const, and var in JavaScript?",
    answer:
      "var is function-scoped and can be redeclared and updated. let is block-scoped and can be updated but not redeclared. const is block-scoped and cannot be updated or redeclared after initialization. var also has hoisting behavior that can lead to unexpected results, while let and const have temporal dead zones.",
  },
  {
    id: "2",
    question: "Explain the concept of closures in JavaScript",
    answer:
      "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created. They're useful for data privacy, creating function factories, and maintaining state in asynchronous operations.",
  },
  {
    id: "3",
    question: "What is the Virtual DOM and how does it work in React?",
    answer:
      "The Virtual DOM is a JavaScript representation of the actual DOM. React creates a virtual copy of the DOM in memory, and when state changes occur, it creates a new virtual DOM tree. React then compares (diffs) the new tree with the previous one and updates only the parts of the real DOM that have changed. This process is called reconciliation and makes React applications faster.",
  },
  {
    id: "4",
    question: "What are React Hooks and why were they introduced?",
    answer:
      "React Hooks are functions that let you use state and other React features in functional components. They were introduced to solve problems like wrapper hell, huge components, and confusing classes. Common hooks include useState for state management, useEffect for side effects, useContext for consuming context, and useCallback/useMemo for performance optimization.",
  },
  {
    id: "5",
    question: "Explain the difference between == and === in JavaScript",
    answer:
      "== (loose equality) performs type coercion before comparison, meaning it converts operands to the same type before comparing. === (strict equality) compares both value and type without any conversion. For example: '5' == 5 is true, but '5' === 5 is false. It's generally recommended to use === to avoid unexpected behavior.",
  },
  {
    id: "6",
    question: "What is event bubbling and event capturing?",
    answer:
      "Event bubbling is when an event starts from the target element and bubbles up to the root. Event capturing (trickling) is the opposite - the event starts from the root and goes down to the target. You can control this with the third parameter in addEventListener: true for capturing phase, false (default) for bubbling phase. stopPropagation() can prevent further propagation.",
  },
  {
    id: "7",
    question: "What is the difference between synchronous and asynchronous JavaScript?",
    answer:
      "Synchronous JavaScript executes code line by line, blocking subsequent code until the current operation completes. Asynchronous JavaScript allows code to run without blocking, using callbacks, promises, or async/await. This is crucial for operations like API calls, file reading, or timers that would otherwise freeze the user interface.",
  },
  {
    id: "8",
    question: "Explain CSS Flexbox and its main properties",
    answer:
      "Flexbox is a CSS layout method for arranging items in a container. Main properties include: display: flex (creates flex container), flex-direction (row/column), justify-content (main axis alignment), align-items (cross axis alignment), flex-wrap (wrapping behavior), and flex-grow/flex-shrink/flex-basis for item sizing. It's ideal for one-dimensional layouts.",
  },
  {
    id: "9",
    question: "What is CSS Grid and when would you use it over Flexbox?",
    answer:
      "CSS Grid is a two-dimensional layout system that works with rows and columns simultaneously. Use Grid for complex layouts, when you need precise control over both dimensions, or when designing page-level layouts. Use Flexbox for one-dimensional layouts, component-level layouts, or when you need items to grow/shrink dynamically.",
  },
  {
    id: "10",
    question: "What are the different ways to center an element in CSS?",
    answer:
      "Several methods: 1) Flexbox: display: flex; justify-content: center; align-items: center; 2) Grid: display: grid; place-items: center; 3) Absolute positioning: position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 4) Margin auto for horizontal: margin: 0 auto; 5) Text-align: center for inline elements.",
  },
  {
    id: "11",
    question: "What is the difference between null and undefined in JavaScript?",
    answer:
      "undefined means a variable has been declared but not assigned a value, or a function doesn't return anything. null is an intentional assignment representing 'no value' or 'empty value'. typeof undefined returns 'undefined', while typeof null returns 'object' (this is a known JavaScript quirk). Both are falsy values.",
  },
  {
    id: "12",
    question: "Explain the concept of hoisting in JavaScript",
    answer:
      "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation. var declarations are hoisted and initialized with undefined. let and const are hoisted but not initialized (temporal dead zone). Function declarations are fully hoisted, while function expressions are not. This can lead to unexpected behavior if not understood properly.",
  },
]

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQuestions = frontendQuestions.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Frontend Interview Q&A</h1>
          <p className="text-muted-foreground">Common frontend development interview questions and answers</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No questions found matching your search.</p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {filteredQuestions.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="text-muted-foreground leading-relaxed">{item.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {filteredQuestions.length} question{filteredQuestions.length !== 1 ? "s" : ""} available
        </div>
      </div>
    </div>
  )
}
