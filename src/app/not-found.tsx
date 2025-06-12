import Link from "next/link"
import { Heart } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mb-6">
        <Heart className="h-8 w-8 text-blue-500" />
      </div>
      <h1 className="text-4xl font-bold mb-2 text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">The page you are looking for might have been moved, deleted, or does not exist.</p>
      <Link href="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
          Go to Home
        </button>
      </Link>
    </div>
  )
}
