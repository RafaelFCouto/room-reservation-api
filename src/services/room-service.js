const roomRepository        = require('../repositories/room-repository');
const reservationRepository = require('../repositories/reservation-repository');

const { timeRange } = require('../utils/input');

class RoomService {
  // Regras aplicaveis: RN-01, RN-06 (docs/regras_negocio.md).
  async getAvailableRooms(startTime, endTime) {
    const range = timeRange(startTime, endTime, true);
    const occupiedIds = range
      ? await reservationRepository.findOccupiedRoomIds(range.start, range.end)
      : await reservationRepository.findOccupiedRoomIds();
    return roomRepository.findExcludingIds(occupiedIds);
  }

  // Regras aplicaveis: RN-07 (docs/regras_negocio.md).
  async createRoom(_data, _user) {
    throw Object.assign(new Error('Not implemented'), { status: 501 });
  }
}

module.exports = new RoomService();
