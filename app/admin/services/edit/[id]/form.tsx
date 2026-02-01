"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { ServiceType } from "../../page"

export default function FormService({
  service,
}: {
  service: ServiceType
}) {
  const [name, setName] = useState(service.name)
  const [min, setMin] = useState(service.min_usage)
  const [max, setMax] = useState(service.max_usage)
  const [price, setPrice] = useState(service.price)

  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/services/${service.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        },
        body: JSON.stringify({
          name,
          min_usage: min,
          max_usage: max,
          price,
        }),
      }
    )

    router.push("/admin/services")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full p-3 rounded bg-slate-700 text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        className="w-full p-3 rounded bg-slate-700 text-white"
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
      />

      <input
        type="number"
        className="w-full p-3 rounded bg-slate-700 text-white"
        value={max}
        onChange={(e) => setMax(Number(e.target.value))}
      />

      <input
        type="number"
        className="w-full p-3 rounded bg-slate-700 text-white"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <button
        type="submit"
        className="w-full bg-emerald-500 text-black font-bold py-3 rounded"
      >
        Simpan Perubahan
      </button>
    </form>
  )
}
