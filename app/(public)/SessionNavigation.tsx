"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "../(private)/LogoutButton";

export default function SessionNavigation() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("No se pudo consultar la sesión");
        const data: unknown = await response.json();
        if (
          typeof data !== "object" || data === null ||
          !("isAuthenticated" in data) || typeof data.isAuthenticated !== "boolean"
        ) throw new Error("Respuesta de sesión no válida");
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <span aria-label="Consultando sesión" className="inline-block h-10 w-32 animate-pulse rounded-lg bg-gray-100" />;
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Iniciar Sesión
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/reservations" className="font-medium hover:text-blue-600">Mis reservas</Link>
      <LogoutButton onLoggedOut={() => {
        setIsAuthenticated(false);
        router.replace("/");
        router.refresh();
      }} />
    </div>
  );
}
