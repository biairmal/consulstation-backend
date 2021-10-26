const { Seeder } = require('mongoose-data-seed')
const { Admin } = require('../models')

const data = [
  {
    email: 'admin1@gmail.com',
    username: 'admin1',
    password: 'dummypassword',
    firstName: 'Dummy',
    lastName: 'Admin1',
    phone: '0128310231',
  },
  {
    email: 'admin2@gmail.com',
    username: 'admin2',
    password: 'dummypassword',
    firstName: 'Dummy',
    lastName: 'Admin2',
    phone: '0128310231',
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
