# Gran Torneo Galáctico

Sistema de gestión de combates y ranking para el Gran Torneo Galáctico, donde las especies más poderosas del universo compiten cada 500 años.

## Descripción

Aplicación web full stack que permite:

- **Registrar especies** con nombre, nivel de poder y habilidad especial
- **Iniciar combates** entre dos especies con resolución automática del ganador
- **Generar combates aleatorios** entre especies registradas
- **Consultar el ranking** ordenado por victorias

### Reglas de combate

- Gana la especie con mayor nivel de poder
- En caso de empate, gana la que tenga el nombre alfabéticamente primero

---

## Stack tecnológico


| Capa              | Tecnología                       |
| ----------------- | -------------------------------- |
| Frontend          | Angular 19 + Angular Material 19 |
| Backend           | Java 21 LTS + Spring Boot 3.4    |
| Base de datos     | PostgreSQL 17                    |
| Migraciones       | Flyway 10                        |
| Documentación API | OpenAPI 3 / Swagger UI           |


---

## Requisitos

### Opción A — Docker (recomendado)

- Docker Desktop 4.x o superior
- Docker Compose v2

### Opción B — Local

- Java 21 LTS ([Adoptium](https://adoptium.net/))
- Maven 3.9+
- Node.js 22 LTS + npm
- PostgreSQL 17 corriendo localmente

---

## Instalación y ejecución

### Opción A — Docker Compose (más fácil)

```bash
# Clonar el repositorio
git clone https://github.com/Haku31/Gran-torneo-galactico.git
cd gran-torneo-galactico

# Levantar todos los servicios
docker-compose up --build
```

Acceder a:

- Frontend: [http://localhost:4200](http://localhost:4200)
- Backend API: [http://localhost:8080](http://localhost:8080)
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

Para detener:

```bash
docker-compose down
```

---

### Opción B — Ejecución local

#### 1. Base de datos

```sql
-- Conectarse a PostgreSQL y ejecutar:
CREATE DATABASE torneo_galactico;
CREATE USER torneo_user WITH PASSWORD 'torneo_pass';
GRANT ALL PRIVILEGES ON DATABASE torneo_galactico TO torneo_user;
```

#### 2. Backend

```bash
cd backend
mvn spring-boot:run
# Servidor disponible en http://localhost:8080
```

#### 3. Frontend

```bash
cd frontend
npm install
npm start
# Aplicación disponible en http://localhost:4200
```

---

## API REST


| Método | Endpoint              | Descripción                        |
| ------ | --------------------- | ---------------------------------- |
| GET    | `/api/species`        | Listar todas las especies          |
| POST   | `/api/species`        | Registrar nueva especie            |
| GET    | `/api/combats`        | Historial de combates              |
| POST   | `/api/combats`        | Iniciar combate entre dos especies |
| POST   | `/api/combats/random` | Combate aleatorio                  |
| GET    | `/api/ranking`        | Ranking por victorias              |


Documentación interactiva completa: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

---

## Tests

```bash
cd backend
mvn test
```

Incluye:

- Tests unitarios de la lógica de combate (`SpeciesServiceTest`)
- Tests de integración con H2 en memoria (`TorneoGalacticoIntegrationTest`)

---

## Estructura del proyecto

```
gran-torneo-galactico/
├── backend/                          # Spring Boot API
│   ├── src/main/java/com/torneo/galactico/
│   │   ├── presentation/             # Controllers + DTOs
│   │   ├── application/service/      # Lógica de negocio
│   │   ├── domain/entity/            # Entidades JPA
│   │   └── infrastructure/           # Repositorios + config
│   └── src/main/resources/
│       └── db/migration/             # Scripts Flyway
├── frontend/                         # Angular 19
│   └── src/app/
│       ├── core/                     # Services + models
│       └── features/                 # species, combats, ranking
├── docker-compose.yml
└── README.md
```

---

## Decisiones de diseño

- **PostgreSQL** como base de datos principal por la naturaleza relacional de los datos (especies, combates, ranking) y necesidad de consistencia ACID al actualizar victorias.
- **Flyway** para control de versiones del esquema de base de datos, garantizando reproducibilidad en cualquier entorno.
- **Nombres denormalizados en combates**: la tabla `combats` almacena los nombres de las especies además de sus IDs para preservar el historial aunque una especie sea modificada.
- **Standalone components (Angular 19)**: arquitectura moderna sin NgModules, usando signals para estado reactivo.
- **Records Java**: DTOs implementados como `record` de Java 21 para inmutabilidad y código conciso.

