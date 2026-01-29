"use client";

import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUpPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const request = JSON.stringify({
        username,
        password,
        phone,
        name,
      });
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/admins`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: request,
      });
      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message || "Gagal melakukan registrasi", {
          containerId: "toastSignUp",
        });
      } else {
        toast.success(responseData.message || "Registrasi berhasil!", {
          containerId: "toastSignUp",
        });
        // Reset form
        setUsername("");
        setPassword("");
        setName("");
        setPhone("");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("Terjadi kesalahan saat mendaftar", {
        containerId: "toastSignUp",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900 p-3 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

      <ToastContainer containerId="toastSignUp" />

      <div className="relative z-10 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-8 w-full md:w-1/2 lg:w-1/3 rounded-3xl shadow-2xl border border-emerald-500/30 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-emerald-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Daftar Admin
          </h1>
          <p className="text-emerald-300/80 text-sm">
            Buat akun admin PDAM baru
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Username */}
          <div className="group">
            <label
              htmlFor="username"
              className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider group-focus-within:text-emerald-200 transition"
            >
              👤 Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border-2 border-emerald-500/40 rounded-lg text-emerald-100 
              focus:outline-none focus:border-emerald-400 focus:bg-slate-800/70 transition duration-200
              placeholder:text-emerald-700/50 backdrop-blur"
              placeholder="Masukkan username"
              required
            />
          </div>

          {/* Password */}
          <div className="group">
            <label
              htmlFor="password"
              className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider group-focus-within:text-emerald-200 transition"
            >
              🔑 Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border-2 border-emerald-500/40 rounded-lg text-emerald-100
              focus:outline-none focus:border-emerald-400 focus:bg-slate-800/70 transition duration-200
              placeholder:text-emerald-700/50 backdrop-blur"
              placeholder="Buat password yang kuat"
              required
            />
          </div>

          {/* Nama Lengkap */}
          <div className="group">
            <label
              htmlFor="name"
              className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider group-focus-within:text-emerald-200 transition"
            >
              👤 Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border-2 border-emerald-500/40 rounded-lg text-emerald-100
              focus:outline-none focus:border-emerald-400 focus:bg-slate-800/70 transition duration-200
              placeholder:text-emerald-700/50 backdrop-blur"
              placeholder="Nama lengkap Anda"
              required
            />
          </div>

          {/* Phone */}
          <div className="group">
            <label
              htmlFor="phone"
              className="block text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider group-focus-within:text-emerald-200 transition"
            >
              📱 Nomor Telepon
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border-2 border-emerald-500/40 rounded-lg text-emerald-100
              focus:outline-none focus:border-emerald-400 focus:bg-slate-800/70 transition duration-200
              placeholder:text-emerald-700/50 backdrop-blur"
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl
            hover:shadow-lg hover:shadow-emerald-500/50 transition duration-200 transform hover:scale-105 disabled:hover:scale-100
            disabled:opacity-75 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "⏳ Sedang mendaftar..." : "✓ Daftar Sekarang"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-emerald-500/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800/40 text-emerald-400">Atau</span>
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-emerald-300/80">
          Sudah punya akun?
          <Link
            href="/sign-in"
            className="ml-2 font-bold text-emerald-400 hover:text-cyan-400 transition inline-flex items-center gap-1"
          >
            Masuk di sini
            <span className="text-lg">→</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
