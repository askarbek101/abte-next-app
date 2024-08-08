'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CreateTaskSchema } from "./_lib/validations"
import { generateOrderDetailPdf } from "@/generator/pdf/core"
import { DeliveryType, Order, Priority, Role, Status } from "@/types/core"
import { calculateVolume } from "@/calculator/core"


export default function HomePage() {
  const router = useRouter()

  async function handleClick() {

    const order : Order = {
      id: "r6nIYPeTah4v23",
      code: "T1231",
      description: "Order Number",
      invoice_url: "https://utfs.io/f/0bd89e34-9195-4f1a-a545-4ee4ab1184e0-m8t5f8.pdf",
      label: "1234567890",
      status: Status.CREATED,
      priority: Priority.LOW,
      volume: await calculateVolume(20, 30, 40),
      height: 20,
      width: 30,
      length: 40,
      weight: 50,
      price: await calculatePrice(20, 30, 40, 50),
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
        role: Role.USER
      },
      recipient: {
        id: "2",
        name: "Zhakup Bolat",
        email: "recipient@example.com",
        phone: "77711230333",
        address: "Kazakhstan, Almaty, 100000, Panfilova 83",
        role: Role.USER
      },
      sender: {
        id: "3",
        name: "Zhylkybay Baurzhan",
        email: "sender@example.com",
        phone: "87029555233",
        address: "Kazakhstan, Almaty, 100000, Abay 123",
        role: Role.USER
      },
      insurance_cost: 10,
      number_of_packages: 1,
      value_of_goods: 1000,
      created_at: new Date(),
      updated_at: new Date()
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
function calculatePrice(arg0: number, arg1: number, arg2: number, arg3: number): number | PromiseLike<number | undefined> | undefined {
  throw new Error("Function not implemented.")
}

