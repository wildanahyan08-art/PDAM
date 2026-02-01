import { getCookies } from "@/helper/cookies";
import Link from "next/link";

/* ================= TYPES ================= */

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: ServiceType[];
  count: number;
}

export interface ServiceType {
  id: number;
  name: string;
  min_usage: number;
  max_usage: number;
  price: number;
  owner_token: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= FETCH ================= */

async function getServices(): Promise<ServiceResponse> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services`;
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        Authorization: `Bearer ${await getCookies("token")}`,
      },
    });

    const responseData: ServiceResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: responseData.message,
        data: [],
        count: 0,
      };
    }

    return responseData;
  } catch {
    return {
      success: false,
      message: "Failed to fetch services",
      data: [],
      count: 0,
    };
  }
}

/* ================= PAGE ================= */

export default async function AdminServicesPage() {
  const response = await getServices();

  if (!response.success) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 to-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl bg-red-50 border border-red-200 px-6 py-5">
            <p className="text-lg font-bold text-red-700">
              Error: {response.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-emerald-900 to-slate-900 px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">💧</span>
              <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Services
              </h1>
            </div>
            <p className="text-emerald-300/80">
              Kelola {response.count} layanan PDAM
            </p>
          </div>

          <Link
            href="/admin/services/add"
            className="bg-linear-to-r from-emerald-500 to-emerald-600
                       hover:from-emerald-600 hover:to-emerald-700
                       text-white font-bold px-7 py-3 rounded-xl
                       transition transform hover:scale-105 shadow-lg"
          >
            ➕ Tambah Layanan
          </Link>
        </div>

        {/* ================= SERVICE LIST ================= */}
        {response.data.length === 0 ? (
          <div className="rounded-2xl bg-amber-500/20 border border-amber-400/50 px-8 py-12 text-center">
            <span className="text-5xl block mb-4">📭</span>
            <p className="text-lg font-semibold text-amber-200">
              Tidak ada data layanan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {response.data.map((service) => (
              <div
                key={service.id}
                className="relative rounded-2xl bg-linear-to-br
                           from-emerald-500/10 to-cyan-500/10
                           border border-emerald-500/30
                           hover:border-emerald-400/60
                           p-6 transition shadow-lg"
              >
                {/* Badge ID */}
                <div
                  className="absolute top-4 right-4 text-xs font-bold
                             bg-emerald-500/80 text-white
                             px-3 py-1 rounded-full"
                >
                  #{service.id}
                </div>

                {/* CONTENT */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-100">
                      {service.name}
                    </h3>
                    <div className="h-1 w-16 bg-linear-to-r from-emerald-400 to-cyan-400 rounded mt-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/40 rounded-lg p-3">
                      <p className="text-xs text-emerald-400 font-semibold">
                        Min Usage
                      </p>
                      <p className="text-lg font-bold text-emerald-100">
                        {service.min_usage}
                      </p>
                    </div>

                    <div className="bg-slate-800/40 rounded-lg p-3">
                      <p className="text-xs text-emerald-400 font-semibold">
                        Max Usage
                      </p>
                      <p className="text-lg font-bold text-emerald-100">
                        {service.max_usage}
                      </p>
                    </div>

                    <div className="col-span-2 bg-emerald-500/30 rounded-lg p-3">
                      <p className="text-xs text-emerald-300 font-semibold">
                        💰 Harga
                      </p>
                      <p className="text-xl font-bold text-emerald-100">
                        Rp {service.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* ================= ACTION BUTTON ================= */}
                  <div className="flex justify-end pt-4">
                    <Link
                      href={`/admin/services/edit/${service.id}`}
                      className="px-4 py-2 rounded-lg text-sm font-semibold
                                 bg-emerald-500/20 text-emerald-300
                                 hover:bg-emerald-500 hover:text-black
                                 transition"
                    >
                      ✏️ Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
