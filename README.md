# Plataforma de Ventas – Proyecto ASIR

Este proyecto es una **plataforma de gestión de productos** desarrollada como parte del Proyecto de Fin de Ciclo del Grado Superior de Administración de Sistemas Informáticos en Red (ASIR). La aplicación está construida con:

- **Backend:** Node.js (Express)
- **Base de datos:** MySQL 8
- **Monitorización:** Prometheus + Grafana
- **Contenedores:** Docker y Docker Compose
- **Frontend:** React con TypeScript

---

## Funcionalidades

- Añadir, listar y eliminar productos
- Modo administrador protegido con **login por JWT**
- Dashboard de métricas con Prometheus y Grafana
- Contadores personalizados (productos, peticiones, errores, etc.)

---

##  Instrucciones de despliegue

### 1. Clonar el repositorio

```bash
git clone https://github.com/TherialYisus/PROYECTO-ASIR.git
cd plataforma-ventas
```

### 2. Configurar la base de datos

El servicio de MySQL se configura automáticamente. 

Crea un archivo `.env` basándote en `.env.example` y define tus propias credenciales.

### 3. Arrancar los servicios (backend + base de datos + monitorización)

```bash
docker-compose up --build
```

Esto levanta automáticamente MySQL, el backend y el stack de monitorización.

### 4. Arrancar el frontend

En una terminal separada:

```bash
cd frontend
npm install
npm run dev
```

### 5. URLs de acceso

| Servicio | URL |
|----------|-----|
| Frontend (app) | http://localhost:5173 |
| Backend (API) | http://localhost:3001 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3002 |

> Grafana: usuario `admin`, contraseña `admin`

---

##  Credenciales Demo (para pruebas)

Para entrar como administrador y poder añadir o eliminar productos:

- **Correo:** `admin@demo.com`
- **Contraseña:** `demo1234`

Para entrar como usuario y ver qué funcionalidades tiene disponible:
- **Correo:** `user@demo.com`
- **Contraseña:** `demo1234`

---

## Estructura del proyecto

```
plataforma-ventas/
├── backend/            → Código del backend (Node.js)
│   ├── index.js
│   ├── Dockerfile
│   ├── package.json
├── frontend/           → Código React (opcional si no está separado)
├── prometheus.yml      → Configuración de Prometheus
├── docker-compose.yml
```

---

## Autor

**Jesús Montaño Fernández**  
Proyecto de Fin de Ciclo – ASIR 2025  
