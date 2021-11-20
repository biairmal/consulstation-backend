const { Seeder } = require('mongoose-data-seed')
const { Consultant } = require('../models')

const data = [
  {
    email: 'consultant1@gmail.com',
    username: 'consultant1',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Consultant',
    lastName: 'Bia',
    phone: '085314215672',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    startingYear: 2008,
  },
  {
    email: 'consultant2@gmail.com',
    username: 'consultant2',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Consultant',
    lastName: 'Fariz',
    phone: '08992341232',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    profilePicture: {
      filename: 'jutaanorangtidakmenyadari',
      url: 'https://image.akurat.co/images/uploads/images/akurat_20191119073024_c0PV50.jpg',
    },
    startingYear: 2004,
  },
  {
    email: 'consultant3@gmail.com',
    username: 'consultant3',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Consultant',
    lastName: 'Hanif',
    phone: '08124422145',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    startingYear: 2009,
  },
  {
    email: 'consultant4@gmail.com',
    username: 'consultant4',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Asep',
    lastName: 'Balon',
    phone: '08991243221',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    profilePicture: {
      filename: 'sudahkuduga',
      url: 'https://d2rbodpj0xodc.cloudfront.net/stories/859933499086341636/08a91a50-952d-4b58-a01d-964ddf3f3ddf.jpeg',
    },
    startingYear: 2013,
  },
  {
    email: 'consultant5@gmail.com',
    username: 'consultant5',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Bambang',
    lastName: 'Solatip',
    phone: '08521324423',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    profilePicture: {
      filename: 'gantengmaksimal',
      url: 'http://cdn-2.tstatic.net/jabar/foto/bank/images/meme-kocak-benci-aku_20150731_093448.jpg',
    },

    startingYear: 2012,
  },
  {
    email: 'consultant6@gmail.com',
    username: 'consultant6',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Ajay',
    lastName: 'Knalpot',
    phone: '08124233123',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    startingYear: 2011,
  },
  {
    email: 'consultant7@gmail.com',
    username: 'consultant7',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Hari',
    lastName: 'Hariman',
    phone: '089123421234',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    startingYear: 2012,
  },
  {
    email: 'consultant8@gmail.com',
    username: 'consultant8',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Jajang',
    lastName: 'Helix',
    phone: '089123411134',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    startingYear: 2006,
  },
  {
    email: 'consultant9@gmail.com',
    username: 'consultant9',
    password: '$2b$12$e4ToFKpIocWYuPwZShmJ3u13wjgnrwhbqI2W0XMEi.08Zlh4jr0wK',
    firstName: 'Cecep',
    lastName: 'Hernandez',
    phone: '082344123423',
    npwp: '112313131',
    cv: {
      filename: 'dummy',
      url: 'https://www.google.com',
    },
    startingYear: 201,
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
