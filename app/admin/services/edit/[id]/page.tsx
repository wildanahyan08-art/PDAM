"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCookies } from "@/helper/cookies";

interface ServiceType {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
}

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [minUsage, setMinUsage] = useState<number>(0);
  const [maxUsage, setMaxUsage] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);

  /** GET DETAIL SERVICE */
  async function getServiceDetail() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}`,
        {
          headers: {
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${await getCookies("token")}`,
          },
          cache: "no-store",
        },
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      setName(json.data.name);
      setMinUsage(json.data.min_usage);
      setMaxUsage(json.data.max_usage);
      setPrice(json.data.price);
    } catch (error) {
      alert("Gagal mengambil data service");
    } finally {
      setLoading(false);
    }
  }

  /** UPDATE SERVICE */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
            Authorization: `Bearer ${await getCookies("token")}`,
          },
          body: JSON.stringify({
            name,
            min_usage: minUsage,
            max_usage: maxUsage,
            price,
          }),
        },
      );

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      alert("Service berhasil diperbarui ✅");
      router.push("/admin/services");
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Gagal update service");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    getServiceDetail();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-200">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-300 mb-6">
          ✏️ Edit Service
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-slate-800/40 backdrop-blur border border-emerald-500/30 rounded-2xl p-6 shadow-lg"
        >
          <div>
            <label className="text-emerald-300 text-sm">Nama Service</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900/60 text-white border border-emerald-500/30 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-emerald-300 text-sm">Min Usage</label>
              <input
                type="number"
                value={minUsage}
                onChange={(e) => setMinUsage(Number(e.target.value))}
                required
                className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900/60 text-white border border-emerald-500/30"
              />
            </div>

            <div>
              <label className="text-emerald-300 text-sm">Max Usage</label>
              <input
                type="number"
                value={maxUsage}
                onChange={(e) => setMaxUsage(Number(e.target.value))}
                required
                className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900/60 text-white border border-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="text-emerald-300 text-sm">Harga</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-900/60 text-white border border-emerald-500/30"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-linear-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold px-6 py-2 rounded-xl transition"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-xl border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
