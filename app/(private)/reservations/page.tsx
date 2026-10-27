import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Forzamos que la página sea dinámica para reflejar nuevas reservas al instante
export const dynamic = "force-dynamic";

export default async function MyReservationsPage() {
  // Consultamos las reservas e incluimos la información del espacio relacionado
  const reservations = await prisma.reservation.findMany({
    include: {
      space: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
            <p className="mt-1 text-sm text-gray-600">
              Consulta el historial y estado de tus espacios apartados en CoSpace.
            </p>
          </div>
          <Link
            href="/spaces"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition shadow"
          >
            Reservar otro espacio
          </Link>
        </div>

        {reservations.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-200">
            <p className="text-gray-500 mb-4">No tienes ninguna reserva registrada todavía.</p>
            <Link
              href="/spaces"
              className="text-blue-600 font-semibold hover:underline"
            >
              Explorar catálogo de espacios
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <li key={reservation.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 text-xs font-semibold uppercase rounded-full bg-blue-100 text-blue-800 mb-2">
                        {reservation.status}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {reservation.space.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        🕒 <strong>Inicio:</strong> {new Date(reservation.startTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        🏁 <strong>Fin:</strong> {new Date(reservation.endTime).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-4 sm:pt-0">
                      <span className="text-xl font-extrabold text-blue-600">
                        ${reservation.totalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Creada el {new Date(reservation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
