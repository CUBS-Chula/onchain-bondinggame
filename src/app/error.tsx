"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Something went wrong</h1>
      <p className="text-gray-600 mb-8 max-w-md">Sorry, an unexpected error occurred. Please try again or return to the home page.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={reset} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          Try Again
        </button>
        <Link href="/">
          <button className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  )
}
