"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold mb-4">เกิดข้อผิดพลาดบางอย่าง</h1>
      <p className="text-muted-foreground mb-8 max-w-md">ขออภัย เกิดข้อผิดพลาดบางอย่างในระบบ โปรดลองใหม่อีกครั้ง</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} variant="default">
          ลองใหม่อีกครั้ง
        </Button>
        <Link href="/">
          <Button variant="outline">กลับไปยังหน้าหลัก</Button>
        </Link>
      </div>
    </div>
  )
}
