const { Seeder } = require('mongoose-data-seed')
const { User } = require('../models')

const data = [
  {
    email: 'dummyuser1@gmail.com',
    username: 'dummyuser1',
    password: 'dummypassword',
    firstName: 'Dummy',
    lastName: 'User1',
  },
  {
    email: 'dummyuser2@gmail.com',
    username: 'dummyuser2',
    password: 'dummypassword',
    firstName: 'Dummy',
    lastName: 'User2',
  },
  {
    email: 'dummyuser3@gmail.com',
    username: 'dummyuser3',
    password: 'dummypassword',
    firstName: 'Dummy',
    lastName: 'User3',
  },
]

class UsersSeeder extends Seeder {
  async shouldRun() {
    return User.countDocuments()
      .exec()
      .then((count) => count === 0)
  }

  async run() {
    return User.create(data)
  }
}

module.exports = UsersSeeder
