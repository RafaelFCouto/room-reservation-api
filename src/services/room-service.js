const roomRepository        = require('../repositories/room-repository');
const reservationRepository = require('../repositories/reservation-repository');

class RoomService {
  async getAvailableRooms(startTime, endTime) {
    const rooms = await roomRepository.findAll();

    const available = [];
    for (const room of rooms) {
      const reservations = await reservationRepository.findActiveByRoomId(room.id);
      if (reservations.length === 0) {
        available.push(room);
      }
    }

    return available;
  }

  async createRoom(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new RoomService();
