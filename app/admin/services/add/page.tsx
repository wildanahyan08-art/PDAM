"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCookies } from "@/helper/cookies";

export interface ServiceAddResponse {
  success: boolean;
  message: string;
  data: AddServiceType;
}

export interface AddServiceType {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    min_usage: "",
    max_usage: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await getCookies("token");
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          min_usage: parseInt(formData.min_usage),
          max_usage: parseInt(formData.max_usage),
          price: parseInt(formData.price),
        }),
      });

      const responseData: ServiceAddResponse = await response.json();

      if (!response.ok) {
        setError(responseData?.message || "Gagal menambahkan layanan");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({ name: "", min_usage: "", max_usage: "", price: "" });

      // Redirect ke halaman services setelah 1.5 detik
      setTimeout(() => {
        router.push("/admin/services");
      }, 1500);
    } catch (err) {
      setError("Terjadi kesalahan saat menambahkan layanan");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold mb-6 transition transform hover:scale-105"
          >
            <span>←</span> Kembali
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Tambah Layanan
            </h1>
          </div>
          <p className="text-emerald-300/80">
            Buat layanan PDAM baru dengan mengisi form di bawah
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/60 px-6 py-4 backdrop-blur-sm animate-pulse">
            <p className="text-green-200 font-semibold flex items-center gap-2">
              <span>✓</span> Layanan berhasil ditambahkan! Mengalihkan...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-500/30 to-orange-500/30 border border-red-400/60 px-6 py-4 backdrop-blur-sm">
            <p className="text-red-200 font-semibold flex items-center gap-2">
              <span>✗</span> {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 shadow-2xl p-8 space-y-6 backdrop-blur-sm"
        >
          {/* Nama Layanan */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider"
            >
              📝 Nama Layanan <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Sambungan Rumah"
              required
              className="w-full px-5 py-3 rounded-lg bg-slate-800/50 border border-emerald-500/40 text-emerald-100 placeholder-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition backdrop-blur"
            />
          </div>

          {/* Min & Max Usage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="min_usage"
                className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider"
              >
                 Minimum <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="min_usage"
                name="min_usage"
                value={formData.min_usage}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full px-5 py-3 rounded-lg bg-slate-800/50 border border-emerald-500/40 text-emerald-100 placeholder-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition backdrop-blur"
              />
            </div>

            <div>
              <label
                htmlFor="max_usage"
                className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider"
              >
                Maximum <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="max_usage"
                name="max_usage"
                value={formData.max_usage}
                onChange={handleChange}
                placeholder="0"
                required
                className="w-full px-5 py-3 rounded-lg bg-slate-800/50 border border-emerald-500/40 text-emerald-100 placeholder-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition backdrop-blur"
              />
            </div>
          </div>

          {/* Harga */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider"
            >
              💰 Harga (Rp) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              required
              className="w-full px-5 py-3 rounded-lg bg-slate-800/50 border border-emerald-500/40 text-emerald-100 placeholder-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition backdrop-blur"
            />
          </div>

          {/* Button Group */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "⏳" : "✓"}</span>
              {loading ? "Menyimpan..." : "Simpan Layanan"}
            </button>
            <Link
              href="/admin/services"
              className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-emerald-200 font-bold py-3 rounded-lg transition text-center border border-slate-600/50 backdrop-blur"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
