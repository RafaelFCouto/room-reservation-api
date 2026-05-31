const express        = require('express');
const authenticate   = require('../middleware/auth');
const roomController = require('../controllers/room-controller');

const router = express.Router();

/**
 * @swagger
 * /rooms/available:
 *   get:
 *     summary: List available rooms
 *     tags: [Rooms]
 *     security:
 *       - UserIdAuth: []
 *     parameters:
 *       - in: query
 *         name: start_time
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         example: "2026-06-10T10:00:00Z"
 *         description: Desired reservation start time
 *       - in: query
 *         name: end_time
 *         schema:
 *           type: string
 *           format: date-time
 *         required: false
 *         example: "2026-06-10T12:00:00Z"
 *         description: Desired reservation end time
 *     responses:
 *       200:
 *         description: List of available rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       401:
 *         $ref: '#/components/responses/Error401'
 */
router.get('/available', authenticate, roomController.getAvailableRooms.bind(roomController));

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - UserIdAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *               - building
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Lab 105"
 *               capacity:
 *                 type: integer
 *                 example: 25
 *               building:
 *                 type: string
 *                 example: "B"
 *               resources:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["projector"]
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, MAINTENANCE]
 *                 example: "AVAILABLE"
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       409:
 *         $ref: '#/components/responses/Error409Duplicate'
 *       422:
 *         $ref: '#/components/responses/Error422Room'
 */
router.post('/', authenticate, roomController.createRoom.bind(roomController));

module.exports = router;
