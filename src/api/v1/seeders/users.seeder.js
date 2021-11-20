const { Seeder } = require('mongoose-data-seed')
const { User } = require('../models')

const data = [
  {
    email: 'dummyuser1@gmail.com',
    username: 'dummyuser1',
    password: 'dummypassword',
    firstName: 'Bia',
    lastName: 'Irmal',
    phone: '081231225231',
  },
  {
    email: 'dummyuser2@gmail.com',
    username: 'dummyuser2',
    password: 'dummypassword',
    firstName: 'Fariz',
    lastName: 'Fairuz',
    phone: '087214125332',
  },
  {
    email: 'dummyuser3@gmail.com',
    username: 'dummyuser3',
    password: 'dummypassword',
    firstName: 'Hanif',
    lastName: 'Prasetiyo',
    phone: '085366124231',
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
