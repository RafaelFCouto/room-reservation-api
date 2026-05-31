# Room Reservation API

REST API for managing room reservations at IFAM — Campus Manaus Zona Leste.

## Stack

- **Node.js** + **Express**
- **Sequelize** ORM + **SQLite** (in-memory)
- **Swagger UI** — interactive docs at `/api-docs`

## Setup

```bash
npm install
npm run dev
```

Server starts at `http://localhost:3000`.
Swagger UI available at `http://localhost:3000/api-docs`.

> The database is in-memory — schema and seed data are created automatically on startup.

---

## Authentication

All routes require the `X-User-Id` header with the ID of the authenticated user.

**Seed users:**

| ID | Name          | Email                 | Profile     |
|----|---------------|-----------------------|-------------|
| 1  | Alice Santos  | alice@ifam.edu.br     | student     |
| 2  | Bob Ferreira  | bob@ifam.edu.br       | professor   |
| 3  | Carol Mendes  | carol@ifam.edu.br     | coordinator |

**Example:**
```
X-User-Id: 2
```

---

## Seed Data — Rooms

| ID | Name     | Building | Capacity | Status      |
|----|----------|----------|----------|-------------|
| 1  | Lab 101  | A        | 30       | AVAILABLE   |
| 2  | Room 202 | B        | 15       | AVAILABLE   |
| 3  | Lab 103  | A        | 40       | MAINTENANCE |
| 4  | Room 304 | C        | 20       | AVAILABLE   |

---

## Routes

### Rooms

#### `GET /rooms/available`

Lists rooms available for reservation.

**Query parameters:**

| Parameter  | Type     | Required | Description                  |
|------------|----------|----------|------------------------------|
| start_time | ISO 8601 | No       | Desired reservation start    |
| end_time   | ISO 8601 | No       | Desired reservation end      |

**Request:**
```bash
curl -X GET "http://localhost:3000/rooms/available?start_time=2026-06-10T10:00:00Z&end_time=2026-06-10T12:00:00Z" \
  -H "X-User-Id: 1"
```

**Response `200`:**
```json
[
  {
    "id": 1,
    "name": "Lab 101",
    "capacity": 30,
    "building": "A",
    "resources": ["projector", "whiteboard"],
    "status": "AVAILABLE"
  }
]
```

---

#### `POST /rooms`

Creates a new room.

**Request body:**

| Field     | Type            | Required | Description                        |
|-----------|-----------------|----------|------------------------------------|
| name      | string          | Yes      | Room name                          |
| capacity  | integer         | Yes      | Maximum number of occupants        |
| building  | string          | Yes      | Building identifier                |
| resources | array\<string\> | No       | Available resources in the room    |
| status    | string          | No       | `AVAILABLE` or `MAINTENANCE`       |

**Request:**
```bash
curl -X POST "http://localhost:3000/rooms" \
  -H "X-User-Id: 2" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lab 105",
    "capacity": 25,
    "building": "B",
    "resources": ["projector", "whiteboard"],
    "status": "AVAILABLE"
  }'
```

**Response `201`:**
```json
{
  "id": 5,
  "name": "Lab 105",
  "capacity": 25,
  "building": "B",
  "resources": ["projector", "whiteboard"],
  "status": "AVAILABLE"
}
```

---

### Reservations

#### `POST /reservations`

Creates a new reservation.

**Request body:**

| Field      | Type     | Required | Description                  |
|------------|----------|----------|------------------------------|
| room_id    | integer  | Yes      | ID of the room to reserve    |
| start_time | ISO 8601 | Yes      | Reservation start time       |
| end_time   | ISO 8601 | Yes      | Reservation end time         |
| purpose    | string   | No       | Reason for the reservation   |

**Request:**
```bash
curl -X POST "http://localhost:3000/reservations" \
  -H "X-User-Id: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "room_id": 1,
    "start_time": "2026-06-10T10:00:00Z",
    "end_time": "2026-06-10T12:00:00Z",
    "purpose": "Study group"
  }'
```

**Response `201`:**
```json
{
  "id": 1,
  "room_id": 1,
  "user_id": 1,
  "start_time": "2026-06-10T10:00:00.000Z",
  "end_time": "2026-06-10T12:00:00.000Z",
  "status": "PENDING",
  "purpose": "Study group"
}
```

**Error responses:**

| Status | Reason                                        |
|--------|-----------------------------------------------|
| 409    | Time slot conflict or user has active reservation |
| 422    | Validation error (duration, maintenance room) |

---

#### `DELETE /reservations/:id`

Cancels a reservation.

**Request:**
```bash
curl -X DELETE "http://localhost:3000/reservations/1" \
  -H "X-User-Id: 1"
```

**Response `200`:**
```json
{
  "id": 1,
  "status": "CANCELLED",
  ...
}
```

---

#### `PATCH /reservations/:id/status`

Updates the status of a reservation.

**Request body:**

| Field  | Type   | Required | Values                    |
|--------|--------|----------|---------------------------|
| status | string | Yes      | `CONFIRMED` or `CANCELLED` |

**Request:**
```bash
curl -X PATCH "http://localhost:3000/reservations/1/status" \
  -H "X-User-Id: 3" \
  -H "Content-Type: application/json" \
  -d '{ "status": "CONFIRMED" }'
```

**Response `200`:**
```json
{
  "id": 1,
  "status": "CONFIRMED",
  ...
}
```

---

#### `POST /reservations/:id/confirm`

Confirms a reservation directly.

**Request:**
```bash
curl -X POST "http://localhost:3000/reservations/1/confirm" \
  -H "X-User-Id: 3"
```

**Response `200`:**
```json
{
  "id": 1,
  "status": "CONFIRMED",
  ...
}
```

---

#### `GET /reservations/user/:id`

Returns all reservations for a given user.

**Request:**
```bash
curl -X GET "http://localhost:3000/reservations/user/1" \
  -H "X-User-Id: 1"
```

**Response `200`:**
```json
[
  {
    "id": 1,
    "room_id": 1,
    "user_id": 1,
    "start_time": "2026-06-10T10:00:00.000Z",
    "end_time": "2026-06-10T12:00:00.000Z",
    "status": "PENDING",
    "purpose": "Study group"
  }
]
```

---

## Status Reference

### Room status

| Value       | Description                          |
|-------------|--------------------------------------|
| AVAILABLE   | Room is available for reservation    |
| MAINTENANCE | Room is under maintenance            |

### Reservation status

| Value     | Description                     |
|-----------|---------------------------------|
| PENDING   | Awaiting confirmation           |
| CONFIRMED | Confirmed by coordinator        |
| CANCELLED | Cancelled                       |

### User profiles

| Value       | Description                              |
|-------------|------------------------------------------|
| student     | Can reserve rooms up to 4h               |
| professor   | Can reserve rooms without duration limit |
| coordinator | Can confirm and manage all reservations  |
