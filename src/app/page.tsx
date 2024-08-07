'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CreateTaskSchema } from "./_lib/validations"
import { generateOrderDetailPdf } from "@/generator/pdf/core"


export default function HomePage() {
  const router = useRouter()

  async function handleClick() {
    const order : CreateTaskSchema = {
      description: "Order Number",
      label: "feature",
      status: "todo",
      priority: "high",
      height: 10,
      width: 10,
      length: 10,
      weight: 10,
      volume: 10,
      price: 10,
    }

    var pdfBytes = await generateOrderDetailPdf(order);
    // open pdf in new tab
    window.open(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })), '_blank');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={handleClick}>Go to Tasks</Button>
    </div>
  )
}
