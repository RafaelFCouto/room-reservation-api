const roomService = require('../services/room-service');

class RoomController {
  async getAvailableRooms(req, res) {
    try {
      const { start_time, end_time } = req.query;
      const rooms = await roomService.getAvailableRooms(start_time, end_time);
      return res.status(200).json(rooms);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async createRoom(req, res) {
    try {
      const { name, capacity, building, resources, status } = req.body;

      if (!name || !building) {
        return res.status(422).json({ error: 'name and building are required' });
      }

      const room = await roomService.createRoom(
        { name, capacity, building, resources, status },
        req.user
      );
      return res.status(201).json(room);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = new RoomController();
