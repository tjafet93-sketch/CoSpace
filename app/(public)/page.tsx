import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900">
        Encuentra tu espacio ideal de <span className="text-blue-600">Coworking</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        Reserva escritorios, salas de reuniones y cabinas privadas por horas de forma rápida, segura y flexible.
      </p>
      <div className="flex gap-4">
        <Link
          href="/spaces"
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition"
        >
          Explorar Espacios
        </Link>
      </div>
    </div>
  );
}
