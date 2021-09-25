const mongoose = require('mongoose')

module.exports = () => {
  return mongoose
    .connect(
      `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`
    )
    .then(() => {
      console.log(`Database ${process.env.DB_NAME} is now connected!`)
    })
    .catch((err) => {
      console.log(err)
    })
}
