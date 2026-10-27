"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReservationFormProps {
  spaceId: string;
  pricePerHour: number;
}

export default function ReservationForm({ spaceId, pricePerHour }: ReservationFormProps) {
  const router = useRouter();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ID temporal de prueba para avanzar (reemplázalo con tu ID real de Prisma)
  const userId = "PEGA_AQUI_EL_ID_DE_TU_USUARIO_EN_PRISMA";

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          spaceId,
          startTime,
          endTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo completar la reserva");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/reservations"); // Te redirige directo a tus reservas
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReservation} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          ¡Reserva exitosa! Redirigiendo...
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Hora de inicio</label>
        <input
          type="datetime-local"
          required
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Hora de fin</label>
        <input
          type="datetime-local"
          required
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || success}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Confirmar Reserva"}
        </button>
      </div>
    </form>
  );
}
