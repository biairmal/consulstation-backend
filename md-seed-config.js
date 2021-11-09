const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const Users = require('./src/api/v1/seeders/users.seeder')
const Admins = require('./src/api/v1/seeders/admins.seeder')
const Consultants = require('./src/api/v1/seeders/consultants.seeder')

const mongoURL =
  process.env.DB_URI ||
  `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
exports.seedersList = {
  Users,
  Admins,
  Consultants,
}
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
exports.connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true })
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
exports.dropdb = async () => mongoose.connection.db.dropDatabase()
