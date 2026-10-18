const { Op } = require('sequelize');
const { Room } = require('../db/index');

class RoomRepository {
  findAll(options = {}) {
    return Room.findAll(options);
  }

  findById(id) {
    return Room.findByPk(id);
  }

  findByName(name) {
    return Room.findOne({ where: { name } });
  }

  findExcludingIds(roomIds) {
    return Room.findAll({ where: { id: { [Op.notIn]: roomIds } } });
  }

  create(data) {
    return Room.create(data);
  }
}

module.exports = new RoomRepository();
