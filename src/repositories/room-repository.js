const { Room } = require('../db/index');

class RoomRepository {
  findAll(options = {}) {
    return Room.findAll(options);
  }

  findById(id) {
    return Room.findByPk(id);
  }

  create(data) {
    return Room.create(data);
  }
}

module.exports = new RoomRepository();
