import Link from "next/link";
import SessionNavigation from "./SessionNavigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Barra de navegación superior */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
        <Link href="/" className="text-xl font-bold text-blue-600">
          CoSpace
        </Link>
        <nav className="flex gap-4 items-center">
          <Link href="/" className="hover:text-blue-600 font-medium">Inicio</Link>
          <Link href="/spaces" className="hover:text-blue-600 font-medium">Espacios</Link>
          <SessionNavigation />
        </nav>
      </header>

      {/* Aquí se mostrará el contenido de cada página */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Pie de página */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CoSpace. Todos los derechos reservados.
      </footer>
    </div>
  );
}
