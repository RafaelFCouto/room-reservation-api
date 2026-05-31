const { User, Room } = require('./index');

async function seed() {
  const userCount = await User.count();
  if (userCount > 0) return;

  await User.bulkCreate([
    { name: 'Alice Santos', email: 'alice@ifam.edu.br', profile: 'student'     },
    { name: 'Bob Ferreira', email: 'bob@ifam.edu.br',   profile: 'professor'   },
    { name: 'Carol Mendes', email: 'carol@ifam.edu.br', profile: 'coordinator' },
  ]);

  await Room.bulkCreate([
    { name: 'Lab 101',  capacity: 30, building: 'A', resources: ['projector', 'whiteboard'], status: 'AVAILABLE'   },
    { name: 'Room 202', capacity: 15, building: 'B', resources: ['whiteboard'],              status: 'AVAILABLE'   },
    { name: 'Lab 103',  capacity: 40, building: 'A', resources: ['computers', 'projector'],  status: 'MAINTENANCE' },
    { name: 'Room 304', capacity: 20, building: 'C', resources: ['projector'],               status: 'AVAILABLE'   },
  ]);
}

module.exports = seed;
