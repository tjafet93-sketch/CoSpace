import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validar que vengan los datos obligatorios
    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // 2. Buscar al usuario en la base de datos por email
    const user = await prisma.user.findUnique({
      where: { email },
      // Seleccionamos solo los campos que utiliza el login para evitar leer
      // columnas opcionales que pueden no existir en bases de datos antiguas.
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 3. Comparar la contraseña enviada con la contraseña cifrada
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 4. Retornar los datos del usuario (excluyendo la contraseña)
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      { message: "Inicio de sesión exitoso", user: userWithoutPassword },
      { status: 200 }
    );

    // Guardamos una cookie básica de sesión simulada
    response.cookies.set("cospace_user_role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día de duración
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
