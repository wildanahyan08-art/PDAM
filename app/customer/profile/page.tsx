"use client";

import { getCookies } from "@/helper/cookies";
import { useEffect, useState } from "react";

/* ================= TYPES ================= */
interface Service {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  address?: string;
  user: {
    username: string;
    role: string;
  };
  service?: Service | Service[];
}

/* ================= PAGE ================= */
export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = await getCookies("token");
        if (!token) throw new Error("Token tidak ditemukan");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/customers/me`,
          {
            headers: {
              "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        setCustomer(json.data || json);
      } catch {
        setError("Gagal memuat data customer");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  if (loading)
    return <div className="p-10 text-emerald-300">Loading...</div>;
  if (error)
    return <div className="p-10 text-red-400">{error}</div>;

  const services = customer?.service
    ? Array.isArray(customer.service)
      ? customer.service
      : [customer.service]
    : [];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= PROFILE ================= */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white text-3xl font-bold">
              {customer?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-emerald-100">
                {customer?.name}
              </h1>
              <p className="text-emerald-400 text-sm">
                @{customer?.user.username}
              </p>
            </div> 
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileItem label="Nomor Telepon" value={customer?.phone} />
            <ProfileItem label="Alamat" value={customer?.address || "-"} />
            <ProfileItem label="Role" value={customer?.user.role} />
            <ProfileItem label="Status" value="Aktif" highlight />
          </div>
        </div>

        {/* ================= SERVICE CUSTOMER ================= */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-emerald-300 mb-6">
            🔧 Layanan Anda
          </h2>

          {services.length === 0 ? (
            <p className="text-emerald-400">
              Belum terdaftar pada layanan apa pun
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-emerald-500/20"
                >
                  <p className="text-emerald-100 font-semibold">
                    {s.name}
                  </p>
                  <p className="text-sm text-emerald-400 mt-1">
                    Pemakaian {s.min_usage} – {s.max_usage} m³
                  </p>
                  <p className="mt-3 text-emerald-300 font-bold">
                    Rp {s.price.toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT ================= */

function ProfileItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-emerald-500/20">
      <p className="text-xs uppercase text-emerald-400 mb-1">{label}</p>
      <p
        className={`font-semibold ${
          highlight ? "text-green-400" : "text-emerald-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
