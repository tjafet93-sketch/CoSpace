"use client";

import { useState } from "react";

interface LogoutButtonProps {
  onLoggedOut: () => void;
}

export default function LogoutButton({ onLoggedOut }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("No se pudo cerrar la sesión");
      onLoggedOut();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-red-200 px-4 py-2 font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "Cerrando sesión…" : "Cerrar sesión"}
    </button>
  );
}
