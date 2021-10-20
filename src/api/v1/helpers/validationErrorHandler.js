module.exports = (err) => {
  let errorObj = {}
  // handling duplicate keys
  if (err.code === 11000) {
    Object.keys(err.keyPattern).forEach((key) => {
      errorObj[key] = `${key} already exists`
    })

    return errorObj
  }

  // handling validation errors
  if (err._message === 'User validation failed') {
    Object.keys(err.errors).forEach((key) => {
      errorObj[key] = err.errors[key].message
    })

    return errorObj
  }

  return err
}
