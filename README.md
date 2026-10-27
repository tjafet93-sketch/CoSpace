# CoSpace

Aplicación web para explorar espacios de coworking y gestionar reservas por hora. El proyecto usa Next.js App Router, React, TypeScript, Tailwind CSS, Prisma y PostgreSQL.

## Funcionalidades

- Página de inicio y catálogo de espacios activos.
- Detalle de cada espacio con tipo, descripción, capacidad, tarifa e imagen.
- Registro de usuarios con contraseñas cifradas mediante `bcryptjs` e inicio/cierre de sesión.
- Cookie HTTP-only para mantener el rol de sesión y navegación que consulta el estado de la sesión.
- Creación de reservas con cálculo del precio a partir de la tarifa por hora.
- Vista del historial de reservas.
- Seed con un usuario administrador y espacios de ejemplo.

## Requisitos

- Node.js y npm.
- Una base de datos PostgreSQL accesible desde la aplicación. El proyecto está configurado para usar PostgreSQL, incluido el pooler de Supabase.

## Configuración local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la raíz y configura la conexión:

   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASENA@HOST:5432/postgres?connection_limit=5"
   ```

   Sustituye los valores por los de tu base de datos. Para una URL que ya tenga parámetros, agrega `&connection_limit=5` en vez de `?connection_limit=5`. El límite ayuda a evitar abrir demasiadas conexiones en el pooler de Supabase. No subas `.env` al repositorio.

3. Genera Prisma Client y aplica las migraciones:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. (Opcional) Carga el administrador y los espacios de ejemplo:

   ```bash
   npx prisma db seed
   ```

   El seed crea `admin@cospace.com` con la contraseña inicial `Admin123*`. Cambia esa contraseña si vas a usar la cuenta fuera de un entorno local.

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Comandos disponibles

| Comando | Acción |
| --- | --- |
| `npm run dev` | Inicia Next.js en desarrollo. |
| `npm run build` | Crea la compilación de producción. |
| `npm run start` | Sirve la compilación de producción. |
| `npm run prisma:generate` | Genera Prisma Client desde `prisma/schema.prisma`. |
| `npm run prisma:migrate` | Ejecuta migraciones en desarrollo con Prisma. |
| `npm run prisma:push` | Sincroniza el esquema con la base sin crear una migración. |
| `npm run prisma:studio` | Abre Prisma Studio. |

## Rutas principales

| Ruta | Descripción |
| --- | --- |
| `/` | Inicio y acceso al catálogo. |
| `/spaces` | Lista de espacios activos. |
| `/spaces/[id]` | Detalle y formulario de reserva de un espacio. |
| `/register` | Registro de usuario. |
| `/login` | Inicio de sesión. |
| `/reservations` | Historial de reservas. |

## API

- `POST /api/auth/register`: registra un usuario y cifra la contraseña.
- `POST /api/auth/login`: valida el correo y la contraseña y establece la cookie de sesión.
- `GET /api/auth/session`: indica si la cookie contiene un rol válido.
- `POST /api/auth/logout`: elimina la cookie de sesión.
- `POST /api/reservations`: valida los datos, calcula el costo y crea una reserva.

## Base de datos

El esquema está en `prisma/schema.prisma`; las migraciones versionadas están en `prisma/migrations/`.

- `User`: usuarios, rol, credenciales cifradas y fechas de creación/actualización.
- `Space`: escritorios, salas de reunión y cabinas, con capacidad, precio e indicador de actividad.
- `Reservation`: usuario, espacio, horario, precio total y estado.

## Notas de implementación

- Las rutas del servidor importan el cliente singleton desde `lib/prisma.ts`. En desarrollo se conserva en `globalThis` para reutilizarlo durante las recargas de módulos.
- El login selecciona los campos que necesita y no consulta columnas de token que no usa. Esto evita que una columna opcional de token ausente en una base existente provoque un error al iniciar sesión.
- La interfaz usa estilos de Tailwind CSS y las imágenes de Unsplash están habilitadas en `next.config.ts`.
- El flujo de reserva todavía contiene un ID de usuario de prueba en el formulario y en la página del historial. Para usar reservas por cuenta, hay que sustituir ese valor por la identidad leída de una sesión validada y proteger las rutas privadas en el servidor.
- La cookie actual contiene el rol y se usa para mostrar navegación autenticada; no reemplaza una autorización completa para operaciones privadas.

## Estructura

```text
app/
  (auth)/        páginas de login y registro
  (private)/     detalles, reservas y cierre de sesión
  (public)/      inicio, catálogo y navegación pública
  api/           endpoints de autenticación y reservas
lib/prisma.ts    cliente Prisma compartido
prisma/          esquema, migraciones y datos de ejemplo
```
