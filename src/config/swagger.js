const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Room Reservation API',
      version:     '1.0.0',
      description: 'REST API for managing room reservations at IFAM campus',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        UserIdAuth: {
          type: 'apiKey',
          in:   'header',
          name: 'X-User-Id',
          description: 'Authenticated user ID (1 = student, 2 = professor, 3 = coordinator)',
        },
      },
      schemas: {
        Room: {
          type: 'object',
          properties: {
            id:        { type: 'integer',        example: 1 },
            name:      { type: 'string',         example: 'Lab 101' },
            capacity:  { type: 'integer',        example: 30 },
            building:  { type: 'string',         example: 'A' },
            resources: { type: 'array', items: { type: 'string' }, example: ['projector', 'whiteboard'] },
            status:    { type: 'string',         enum: ['AVAILABLE', 'MAINTENANCE'], example: 'AVAILABLE' },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id:         { type: 'integer', example: 1 },
            room_id:    { type: 'integer', example: 1 },
            user_id:    { type: 'integer', example: 2 },
            start_time: { type: 'string', format: 'date-time', example: '2026-06-10T10:00:00Z' },
            end_time:   { type: 'string', format: 'date-time', example: '2026-06-10T12:00:00Z' },
            status:     { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], example: 'PENDING' },
            purpose:    { type: 'string', example: 'Weekly team meeting' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Room not found' },
          },
        },
      },
      responses: {
        Error401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema:  { $ref: '#/components/schemas/Error' },
              example: { error: 'Missing or invalid X-User-Id header' },
            },
          },
        },
        Error404: {
          description: 'Not found',
          content: {
            'application/json': {
              schema:  { $ref: '#/components/schemas/Error' },
              example: { error: 'Reservation not found' },
            },
          },
        },
        Error409Conflict: {
          description: 'Conflict',
          content: {
            'application/json': {
              schema:  { $ref: '#/components/schemas/Error' },
              example: { error: 'Room is not available for the requested time slot' },
            },
          },
        },
        Error409Duplicate: {
          description: 'Conflict',
          content: {
            'application/json': {
              schema:  { $ref: '#/components/schemas/Error' },
              example: { error: 'Room name already exists' },
            },
          },
        },
        Error422Room: {
          description: 'Unprocessable Entity',
          content: {
            'application/json': {
              schema:  { $ref: '#/components/schemas/Error' },
              example: { error: 'name and building are required' },
            },
          },
        },
        Error422Reservation: {
          description: 'Unprocessable Entity',
          content: {
            'application/json': {
              schema:  { $ref: '#/components/schemas/Error' },
              example: { error: 'Reservation exceeds maximum allowed duration' },
            },
          },
        },
        Error422Status: {
          description: 'Unprocessable Entity',
          content: {
            'application/json': {
              schema:  { $ref: '#/components/schemas/Error' },
              example: { error: 'Cannot transition from CANCELLED to CONFIRMED' },
            },
          },
        },
      },
    },
    security: [{ UserIdAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
