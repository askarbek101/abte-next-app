'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"


export default function HomePage() {
  const router = useRouter()

  function handleClick() {
    console.log('clicked')
    router.push('/tasks')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={handleClick}>Go to Tasks</Button>
    </div>
  )
}
