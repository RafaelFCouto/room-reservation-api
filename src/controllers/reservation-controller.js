const reservationService = require('../services/reservation-service');
const { positiveId, objectBody } = require('../utils/input');

class ReservationController {
  async createReservation(req, res) {
    try {
      const reservation = await reservationService.createReservation(objectBody(req.body), req.user);
      return res.status(201).json(reservation);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async cancelReservation(req, res) {
    try {
      const reservation = await reservationService.cancelReservation(
        positiveId(req.params.id),
        req.user
      );
      return res.status(200).json(reservation);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async updateReservationStatus(req, res) {
    try {
      const { status } = objectBody(req.body);
      const reservation = await reservationService.updateReservationStatus(
        positiveId(req.params.id),
        status,
        req.user
      );
      return res.status(200).json(reservation);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async confirmReservation(req, res) {
    try {
      const reservation = await reservationService.confirmReservation(
        positiveId(req.params.id),
        req.user
      );
      return res.status(200).json(reservation);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async getUserReservations(req, res) {
    try {
      const reservations = await reservationService.getUserReservations(
        positiveId(req.params.id),
        req.user
      );
      return res.status(200).json(reservations);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = new ReservationController();
