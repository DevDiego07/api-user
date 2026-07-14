# User Management API

API REST para gestión de usuarios con autenticación JWT y control de acceso basado en roles.

## Stack

- Node.js
- Express
- SQL Server
- JWT (JSON Web Tokens)
- bcrypt

## Requisitos

- Node.js v18 o superior
- SQL Server
- Base de datos `UserManagementDB` con las tablas `Users` y `RefreshTokens`

## Instalación

1. Clona el repositorio
```bash
git clone https://github.com/DevDiego07/api-user.git
```

2. Instala las dependencias
```bash
npm install
```

3. Crea un archivo `.env` en la raíz con estas variables:
DB_SERVER=tu_servidor
DB_NAME=UserManagementDB
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_PORT=1433
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=tu_secreto_refresh
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3000

4. Inicia el servidor
```bash
npm run dev
```

## Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/register | Registrar nuevo usuario |
| POST | /auth/login | Iniciar sesión |
| POST | /auth/refresh | Renovar access token |
| POST | /auth/logout | Cerrar sesión |

### Usuarios (requieren autenticación)

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| GET | /users | Listar usuarios | admin, user |
| GET | /users/:id | Obtener usuario | admin, user |
| PUT | /users/:id | Actualizar usuario | admin, user |
| DELETE | /users/:id | Eliminar usuario | admin |

## Seguridad

- Passwords encriptadas con bcrypt
- Access token JWT con expiración de 15 minutos
- Refresh token con expiración de 7 días
- Rutas protegidas con middleware de autenticación y autorización