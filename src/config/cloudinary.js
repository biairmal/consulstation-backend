const dotenv = require('dotenv')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const getStorage = (type) => {
  let subFolder = ''
  type = String(type).toLowerCase()

  if (type === 'avatar') subFolder = '/Avatar'
  else if (type === 'cv') subFolder = '/Cv'
  else if (type === 'article') subFolder = '/Article'

  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `/Consulstation${subFolder}`,
      allowedFormats: ['jpeg', 'jpg', 'png', 'pdf'],
    },
  })
}

module.exports = {
  cloudinary,
  getStorage,
}
