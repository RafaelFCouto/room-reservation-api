const express        = require('express');
const swaggerUi      = require('swagger-ui-express');
const swaggerSpec    = require('./config/swagger');
const { sequelize }  = require('./db/index');
const seed           = require('./db/seed');

const roomRoutes        = require('./routes/rooms');
const reservationRoutes = require('./routes/reservations');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/rooms',        roomRoutes);
app.use('/reservations', reservationRoutes);

async function bootstrap() {
  await sequelize.sync({ force: true });
  await seed();
  app.listen(PORT, () => {
    console.log(`Room Reservation API running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

bootstrap();

module.exports = app;
