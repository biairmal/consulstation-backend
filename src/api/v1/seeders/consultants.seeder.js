const { Seeder } = require('mongoose-data-seed')
const { Consultant } = require('../models')

const data = [
  {
    email: 'consultant1@gmail.com',
    username: 'consultant1',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Dummy',
    lastName: 'Consultant1',
    phone: '0128310231',
    npwp: '112313131',
    cv: {
      filename:'dummy',
      url:'https://www.google.com',
    },
    startingYear: 2013,
  },
  {
    email: 'consultant2@gmail.com',
    username: 'consultant2',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Dummy',
    lastName: 'Consultant2',
    phone: '0128310231',
    npwp: '112313131',
    cv: {
      filename:'dummy',
      url:'https://www.google.com',
    },
    startingYear: 2013,
  },
  {
    email: 'consultant3@gmail.com',
    username: 'consultant3',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Dummy',
    lastName: 'Consultant3',
    phone: '0128310231',
    npwp: '112313131',
    cv: {
      filename:'dummy',
      url:'https://www.google.com',
    },
    startingYear: 2013,
  },
]

class ConsultantsSeeder extends Seeder {
  async shouldRun() {
    return Consultant.countDocuments()
      .exec()
      .then((count) => count === 0)
  }

  async run() {
    return Consultant.create(data)
  }
}

module.exports = ConsultantsSeeder
