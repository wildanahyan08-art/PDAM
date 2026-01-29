import Link from "next/link";
import { getCookies } from "@/helper/cookies";

interface Admin {
  name: string;
  phone: string;
  user: {
    username: string;
    role: string;
  };
}

export default async function ProfilePage() {
  const token = await getCookies("token");

  if (!token) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/30 text-center">
          <span className="text-4xl">🔐</span>
          <p className="text-red-400 text-lg font-semibold mt-4">
            Token tidak ditemukan
          </p>
          <p className="text-emerald-300/70 text-sm mt-2">
            Silakan login terlebih dahulu
          </p>
        </div>
      </div>
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admins/me`,
      {
        headers: {
          "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/30 text-center">
            <span className="text-4xl">⚠️</span>
            <p className="text-red-400 font-semibold mt-4">
              Gagal mengambil data profil
            </p>
            <p className="text-emerald-300/70 text-sm mt-2">
              Status: {response.status}
            </p>
          </div>
        </div>
      );
    }

    const result = JSON.parse(responseText);
    const data: Admin = result.data || result;

    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900 p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Profil Administrator
            </h1>
            <p className="text-emerald-300/70 mt-2">
              Kelola akun admin Anda
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden">
            <div className="h-32 bg-linear-to-r from-emerald-600 to-cyan-700"></div>

            <div className="p-8 -mt-16">
              {/* Avatar */}
              <div className="flex justify-center mb-8">
                <div className="w-32 h-32 bg-linear-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center border-4 border-slate-900 text-white text-5xl font-bold shadow-lg">
                  {data.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              </div>

              {/* Name */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-emerald-200">
                  {data.name || "-"}
                </h2>
                <p className="text-emerald-400 mt-1">👨‍💼 Administrator</p>
              </div>

              {/* Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Info label="Username" value={data.user.username} icon="👤" />
                <Info label="Nomor Telepon" value={data.phone} icon="📱" />
                <Info label="Role" value={data.user.role} icon="🔑" />
                <Info label="Status" value="Aktif" icon="✓" green />
              </div>

              {/* Stats */}
              <div className="mt-10 pt-8 border-t border-emerald-500/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <Stat label="Tipe Akun" value="⭐ Pro" />
                  <Stat label="Akses" value="🔓 Penuh" />
                  <Stat label="Verifikasi" value="✓ Ya" green />
                </div>
              </div>

              {/* Menu */}
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4 text-emerald-200">
                  Menu Administrator
                </h3>

                <Link
                  href="/admin/services"
                  className="block p-5 rounded-2xl bg-slate-800/50 border border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-xl">
                      🧾
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-200">
                        Service
                      </p>
                      <p className="text-sm text-emerald-300/70">
                        Kelola daftar layanan
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-emerald-400/60 text-sm">
            Akun Administrator Terverifikasi ✓
          </p>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-red-400">Terjadi kesalahan</p>
      </div>
    );
  }
}

/* ===== COMPONENTS ===== */

function Info({
  label,
  value,
  icon,
  green = false,
}: {
  label: string;
  value: string;
  icon: string;
  green?: boolean;
}) {
  return (
    <div className="p-6 bg-slate-800/50 backdrop-blur rounded-2xl border border-emerald-500/30">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3 text-white">
          {icon}
        </div>
        <p className="text-sm font-semibold text-emerald-300">
          {label}
        </p>
      </div>
      <p
        className={`text-xl font-bold ${
          green ? "text-green-400" : "text-emerald-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div>
      <p className="text-emerald-300/70 text-sm">{label}</p>
      <p
        className={`text-2xl font-bold ${
          green ? "text-green-400" : "text-emerald-400"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
