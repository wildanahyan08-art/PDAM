import { getCookies } from "@/helper/cookies";
import Link from "next/link";

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

/** Create Function to get service data for Backend */
async function getServices(): Promise<ServiceResponse> {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/services`;
    const response = await fetch(url, {
      method: "GET",
      /** saat ada perubahan data, data yang lama akan
       *  ditimpa dengan yang baru */
      cache: "no-store",
      headers: {
        "app-key": process.env.NEXT_PUBLIC_APP_KEY || "",
        Authorization: `Bearer ${await getCookies("token")}`,
      },
    });

    if (!response.ok) {
      const responseData: ServiceResponse = await response.json();
      return {
        success: false,
        message: responseData?.message,
        data: [],
        count: 0,
      };
    }

    const responseData: ServiceResponse = await response.json();
    return responseData;
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch services",
      data: [],
      count: 0,
    };
  }
}

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
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">💧</span>
              <h1 className="text-4xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Services
              </h1>
            </div>
            <p className="text-emerald-300/80">
              Kelola {response.count} layanan PDAM dengan mudah
            </p>
          </div>
          <Link
            href="/admin/services/add"
            className="bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-7 py-3 rounded-xl transition transform hover:scale-105 shadow-lg hover:shadow-emerald-500/50 flex items-center gap-2"
          >
           Tambah Layanan
          </Link>
        </div>

        {/* SERVICE DATA */}
        <div className="space-y-4">
          {response.data.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {response.data.map((service, index) => (
                <div
                  key={service.id}
                  className="group relative rounded-2xl bg-linear-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg hover:shadow-emerald-500/30 p-6 transition-all duration-300 hover:from-emerald-500/15 hover:to-cyan-500/15 backdrop-blur-sm"
                >
                  {/* Decorative element */}
                  <div className="absolute -top-2 -right-2 w-20 h-20 bg-linear-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-2xl group-hover:from-emerald-400/40 group-hover:to-cyan-400/40 transition-all"></div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-linear-to-r from-emerald-500/80 to-cyan-500/80 text-white text-xs font-bold px-3 py-1 rounded-full">
                    #{service.id}
                  </div>

                  <div className="relative z-10 space-y-4">
                    {/* Service Name */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-emerald-100">
                        {service.name}
                      </h3>
                      <div className="h-1 w-16 bg-linear-to-r from-emerald-400 to-cyan-400 rounded mt-2"></div>
                    </div>

                    {/* Grid Data */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/40 rounded-lg p-3 backdrop-blur">
                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          Min Usage
                        </p>
                        <p className="text-lg font-bold text-emerald-100 mt-1">
                          {service.min_usage}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 rounded-lg p-3 backdrop-blur">
                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          Max Usage
                        </p>
                        <p className="text-lg font-bold text-emerald-100 mt-1">
                          {service.max_usage}
                        </p>
                      </div>

                      <div className="bg-linear-to-br from-emerald-500/30 to-cyan-500/30 rounded-lg p-3 backdrop-blur col-span-2">
                        <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                          💰 Harga
                        </p>
                        <p className="text-xl font-bold text-emerald-100 mt-1">
                          Rp {service.price.toLocaleString("id-ID")}
                        </p>
                      </div>

                      <div className="bg-slate-800/40 rounded-lg p-3 backdrop-blur col-span-2">
                        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                          Dibuat
                        </p>
                        <p className="text-sm text-emerald-200 mt-1">
                          {new Date(service.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-emerald-500/0 to-cyan-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/50 px-8 py-12 text-center backdrop-blur-sm">
              <span className="text-5xl mb-4 block">📭</span>
              <p className="text-lg font-semibold text-amber-200">
                Tidak ada data layanan
              </p>
              <p className="text-amber-300/70 mt-2">
                Mulai dengan menambahkan layanan baru
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
