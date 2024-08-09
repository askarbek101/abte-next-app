'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { DeliveryType, Task, Priority, Role, Status, Label } from "@/types/core"
import { calculateVolume, calculatePrice } from "@/calculator/core"
import { generateTaskPdfByTask } from "@/generator/pdf/core"


export default function HomePage() {
  const router = useRouter()

  async function handleClick() {


    const height = 20
    const width = 30
    const length = 40
    const weight = 50
    const volume = await calculateVolume(height, width, length)
    const price = await calculatePrice(volume, weight)

    const task : Task = {
      id: "r6nIYPeTah4v23",
      code: "T1231",
      description: "Order Number",
      invoice_url: "https://utfs.io/f/0bd89e34-9195-4f1a-a545-4ee4ab1184e0-m8t5f8.pdf",
      label: Label.FEATURE,
      status: Status.TODO,
      priority: Priority.LOW,
      volume: volume,
      height: height,
      width: width,
      length: length,
      weight: weight,
      price: price,
      from: {
        id: "1",
        name: "Almaty"
      },
      to: {
        id: "2",
        name: "Astana"
      },
      delivery_type: DeliveryType.DOOR_TO_TERMINAL,
      payer: {
        id: "1",
        abte_id: "ABTE-332223",
        name: "Makhmedov Askarbek",
        bin: "1234567890",
        email: "payer@example.com",
        phone: "77003029701",
        address: "Kazakhstan, Almaty, 100000, Seifulin 456",
        role: Role.USER,
        password: "password"
      },
      recipient: {
        id: "2",
        name: "Zhakup Bolat",
        email: "recipient@example.com",
        phone: "77711230333",
        address: "Kazakhstan, Almaty, 100000, Panfilova 83",
        role: Role.USER,
        password: "password"
      },
      sender: {
        id: "3",
        name: "Zhylkybay Baurzhan",
        email: "sender@example.com",
        phone: "87029555233",
        address: "Kazakhstan, Almaty, 100000, Abay 123",
        role: Role.USER,
        password: "password"
      },
      insurance_cost: 10,
      number_of_packages: 1,
      value_of_goods: 1000,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    var pdfBytes = await generateTaskPdfByTask(task);
    // open pdf in new tab
    window.open(URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' })), '_blank');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={handleClick}>Go to Tasks</Button>
    </div>
  )
}

