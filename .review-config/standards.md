# Coding Standards — room-reservation-api

Project: IFAM Room Reservation API
Stack: Node.js, Express, Sequelize, SQLite

---

## Architecture

Three-layer pattern: `routes → controllers → services → repositories`

- **Routes**: declare endpoints and apply middleware only
- **Controllers**: parse request, call service, return HTTP response
- **Services**: all business logic and validation
- **Repositories**: all DB access — no query logic in services

---

## Error handling

Errors carry an HTTP status via `Object.assign`:

```js
throw Object.assign(new Error('message'), { status: 422 });
```

| Condition | Status |
|---|---|
| Missing/invalid input | 400 |
| Not authenticated | 401 |
| Profile not authorized | 403 |
| Resource not found | 404 |
| Conflict (duplicate, time overlap) | 409 |
| Business rule violation | 422 |

---

## Constants and enums

Always use model-defined frozen constants — never raw strings:

```js
Room.STATUS.AVAILABLE       // not 'AVAILABLE'
Room.STATUS.MAINTENANCE     // not 'MAINTENANCE'
Reservation.STATUS.PENDING  // not 'PENDING'
User.PROFILE.STUDENT        // not 'student'
User.PROFILE.PROFESSOR      // not 'professor'
User.PROFILE.COORDINATOR    // not 'coordinator'
```

No magic numbers. Use named constants:

```js
const MAX_STUDENT_DURATION_MS = 4 * 60 * 60 * 1000; // 4h
const MIN_ADVANCE_MS          = 24 * 60 * 60 * 1000; // 24h
```

---

## Async patterns

Use `Promise.all` for independent concurrent operations:

```js
// correct
const [room, conflicts] = await Promise.all([
  roomRepository.findById(room_id),
  reservationRepository.findConflicts(room_id, start_time, end_time),
]);

// wrong
const room      = await roomRepository.findById(room_id);
const conflicts = await reservationRepository.findConflicts(...);
```

Never use `for...of` with `await` inside when calls are independent — use `Promise.all(array.map(...))`.

---

## Authorization

Profile checks must happen in the service layer before any business logic:

```js
// RN-03: only professor/coordinator can reserve more than 4h
if (duration > MAX_STUDENT_DURATION_MS &&
    user.profile === User.PROFILE.STUDENT) {
  throw Object.assign(new Error('...'), { status: 403 });
}

// RN-07: only professor/coordinator can create rooms
if (user.profile === User.PROFILE.STUDENT) {
  throw Object.assign(new Error('...'), { status: 403 });
}
```

The `authenticate` middleware sets `req.user` — services receive `user` as second argument.

---

## Validation rules (summary)

| Rule | Where enforced |
|---|---|
| `room.status !== MAINTENANCE` before reserving | `ReservationService.createReservation` |
| No time conflicts for same room | `ReservationService.createReservation` |
| `start_time` at least 24h in the future | `ReservationService.createReservation` |
| Duration ≤ 4h for `student` profile | `ReservationService.createReservation` |
| Max 1 active reservation per `student` | `ReservationService.createReservation` |
| Cancel only when `status === PENDING` | `ReservationService.cancelReservation` |
| `MAINTENANCE` rooms excluded from available list | `RoomService.getAvailableRooms` |
| Only `professor`/`coordinator` can create rooms | `RoomService.createRoom` |
| `capacity` must be a positive integer (`> 0`) | `RoomService.createRoom` |
