import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Heart className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">ไม่พบหน้าที่คุณกำลังค้นหา</h2>
      <p className="text-muted-foreground mb-8 max-w-md">หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ</p>
      <Link href="/">
        <Button variant="default">กลับไปยังหน้าหลัก</Button>
      </Link>
    </div>
  )
}
