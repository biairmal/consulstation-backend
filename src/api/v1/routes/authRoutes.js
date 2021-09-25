const controller = require('../controllers/authController')

module.exports = (app) => {
  app.post('/register', controller.register)
  app.post('/login', controller.login)
}
