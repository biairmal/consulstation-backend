const { Seeder } = require('mongoose-data-seed')
const { Admin } = require('../models')

const data = [
  {
    email: 'admin1@gmail.com',
    username: 'admin1',
    password: 'dummypassword',
    firstName: 'Admin',
    lastName: 'Satu',
    phone: '082241237621',
  },
  {
    email: 'admin2@gmail.com',
    username: 'admin2',
    password: 'dummypassword',
    firstName: 'Admin',
    lastName: 'Dua',
    phone: '089912241234',
  },
]

class AdminsSeeder extends Seeder {
  async shouldRun() {
    return Admin.countDocuments()
      .exec()
      .then((count) => count === 0)
  }

  async run() {
    return Admin.create(data)
  }
}

module.exports = AdminsSeeder
