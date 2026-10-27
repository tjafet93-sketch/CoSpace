import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Forzamos que la página sea dinámica para obtener siempre los espacios actualizados de la base de datos
export const dynamic = "force-dynamic";

export default async function SpacesPage() {
  // Consultamos los espacios activos en la base de datos con Prisma
  const spaces = await prisma.space.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Espacios Disponibles</h1>
            <p className="mt-1 text-sm text-gray-600">
              Explora y reserva escritorios, salas de reuniones y cabinas privadas para tu productividad.
            </p>
          </div>
        </div>

        {spaces.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">No hay espacios disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg flex flex-col"
              >
                <div className="relative h-48 w-full bg-gray-200">
                  <img
                    src={space.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"}
                    alt={space.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white uppercase shadow">
                    {space.type}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{space.name}</h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{space.description}</p>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>Capacidad: {space.capacity} {space.capacity === 1 ? 'persona' : 'personas'}</span>
                      <span className="font-bold text-blue-600 text-lg">${space.pricePerHour} / hr</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/spaces/${space.id}`}
                      className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition"
                    >
                      Ver detalles y reservar
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
