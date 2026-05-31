const express                = require('express');
const authenticate           = require('../middleware/auth');
const reservationController  = require('../controllers/reservation-controller');

const router = express.Router();

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room_id
 *               - start_time
 *               - end_time
 *             properties:
 *               room_id:
 *                 type: integer
 *                 example: 1
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-10T10:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-10T12:00:00Z"
 *               purpose:
 *                 type: string
 *                 example: "Study group"
 *     responses:
 *       201:
 *         description: Reservation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       409:
 *         $ref: '#/components/responses/Error409Conflict'
 *       422:
 *         $ref: '#/components/responses/Error422Reservation'
 */
router.post('/', authenticate, reservationController.createReservation.bind(reservationController));

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Reservation cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         $ref: '#/components/responses/Error404'
 *       422:
 *         $ref: '#/components/responses/Error422Status'
 */
router.delete('/:id', authenticate, reservationController.cancelReservation.bind(reservationController));

/**
 * @swagger
 * /reservations/{id}/status:
 *   patch:
 *     summary: Update reservation status
 *     tags: [Reservations]
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, CANCELLED]
 *                 example: "CONFIRMED"
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         $ref: '#/components/responses/Error404'
 *       422:
 *         $ref: '#/components/responses/Error422Status'
 */
router.patch('/:id/status', authenticate, reservationController.updateReservationStatus.bind(reservationController));

/**
 * @swagger
 * /reservations/{id}/confirm:
 *   post:
 *     summary: Confirm a reservation
 *     tags: [Reservations]
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Reservation confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         $ref: '#/components/responses/Error404'
 *       422:
 *         $ref: '#/components/responses/Error422Status'
 */
router.post('/:id/confirm', authenticate, reservationController.confirmReservation.bind(reservationController));

/**
 * @swagger
 * /reservations/user/{id}:
 *   get:
 *     summary: Get all reservations for a user
 *     tags: [Reservations]
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: List of user reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         $ref: '#/components/responses/Error401'
 *       404:
 *         $ref: '#/components/responses/Error404'
 */
router.get('/user/:id', authenticate, reservationController.getUserReservations.bind(reservationController));

module.exports = router;
