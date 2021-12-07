const articleRoutes = require('./articleRoutes')
const authRoutes = require('./authRoutes')
const chatRoutes = require('./chatRoutes')
const dashboardRoutes = require('./dashboardRoutes')
const userRoutes = require('./userRoutes')
const contractPlanRoutes = require('./contractPlanRoutes')
const consultantRoutes = require('./consultantRoutes')
const partnershipRoutes = require('./partnershipRoutes')
const transactionRoutes = require('./transactionRoutes')

module.exports = [
  articleRoutes,
  authRoutes,
  chatRoutes,
  contractPlanRoutes,
  dashboardRoutes,
  userRoutes,
  consultantRoutes,
  partnershipRoutes,
  transactionRoutes,
]
