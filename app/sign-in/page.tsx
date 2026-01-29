"use client";
import Link from "next/link";
import { FormEvent, startTransition, useState, useTransition } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { storeCookies } from "../../helper/cookies";

export interface LoginResponse {
  success?: boolean;
  message: string;
  token?: string;
  role?: string;
  error?: string;
  statusCode?: string;
}

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [pending] = useTransition();
  const router = useRouter();

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();

    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      // ❌ Server / HTTP error
      if (!response.ok) {
        toast.error(data.message || "Terjadi kesalahan server", {
          containerId: "toastLogin",
        });
        return;
      }

      // ✅ Login success
      if (data.success) {
        toast.success(data.message, {
          containerId: "toastLogin",
        });

        startTransition(async function () {
          await storeCookies("token", data.token || "");
          if (data.role === "ADMIN") {
            setTimeout(() => {
              router.push(`/admin/profile`);
            }, 1000);
          } else if (data.role === "CUSTOMER") {
            setTimeout(() => {
              router.push("/customer/profile");
            }, 1000);
          }
        });

        // OPTIONAL: simpan token
        // localStorage.setItem("token", data.token || "")
        // localStorage.setItem("role", data.role || "")
      } else {
        // ⚠️ Username / password salah
        toast.warning(data.message, {
          containerId: "toastLogin",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan koneksi", {
        containerId: "toastLogin",
      });
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900 p-3 flex items-center justify-center relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

      <ToastContainer containerId="toastLogin" />

      <div className="relative z-10 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-8 w-full md:w-1/2 lg:w-1/3 rounded-3xl shadow-2xl border border-emerald-500/30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-emerald-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Login PDAM
          </h1>
          <p className="text-emerald-300/80 text-sm">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
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
              placeholder="Masukkan username Anda"
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
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-linear-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl
            hover:shadow-lg hover:shadow-emerald-500/50 transition duration-200 transform hover:scale-105 disabled:hover:scale-100
            disabled:opacity-75 disabled:cursor-not-allowed mt-6"
          >
            {pending ? "⏳ Sedang login..." : "Masuk"}
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

        {/* Register Link */}
        <p className="text-center text-sm text-emerald-300/80">
          Belum punya akun?
          <Link
            href="/sign-up"
            className="ml-2 font-bold text-emerald-400 hover:text-cyan-400 transition inline-flex items-center gap-1"
          >
            Daftar sekarang
            <span className="text-lg">→</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
