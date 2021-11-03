const articleRoutes = require('./articleRoutes')
const authRoutes = require('./authRoutes')
const chatRoutes = require('./chatRoutes')
const userRoutes = require('./userRoutes')
const contractPlanRoutes = require('./contractPlanRoutes')
const consultantRoutes = require('./consultantRoutes')
const partnershipRoutes = require('./partnershipRoutes')

module.exports = [
  articleRoutes,
  authRoutes,
  chatRoutes,
  contractPlanRoutes,
  userRoutes,
  consultantRoutes,
  partnershipRoutes,
]
