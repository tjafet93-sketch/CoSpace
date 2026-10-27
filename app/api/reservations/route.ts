import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, spaceId, startTime, endTime } = body;

    // Validar campos obligatorios
    if (!userId || !spaceId || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para la reserva" },
        { status: 400 }
      );
    }

    // Buscar el espacio para calcular el precio total basado en las horas
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space || !space.isActive) {
      return NextResponse.json(
        { error: "El espacio seleccionado no está disponible" },
        { status: 404 }
      );
    }

    // Calcular la duración en horas
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (diffInHours <= 0) {
      return NextResponse.json(
        { error: "La hora de fin debe ser posterior a la hora de inicio" },
        { status: 400 }
      );
    }

    // Calcular el precio total
    const totalPrice = diffInHours * space.pricePerHour;

    // Crear la reserva en la base de datos
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        spaceId,
        startTime: start,
        endTime: end,
        totalPrice,
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(
      { message: "¡Reserva creada con éxito!", reservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
