const path = require('node:path')
const crypto = require('node:crypto')
const express = require('express')
const multer = require('multer')

const userController = require('../../controllers/user')

const router = express.Router()
const storage = multer.diskStorage({
	destination: function (_, __, cb) {
		cb(null, path.join(__dirname, '../../public/avatars'))
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = crypto.randomUUID()
		const ext = path.extname(file.originalname)
		const baseName = path.basename(file.originalname, ext)

		cb(null, `${baseName}-${uniqueSuffix}${ext}`)
	},
})

const upload = multer({ storage })

router.get('/avatars/:userId', userController.getUserById)

router.post(
	'/avatars/:userId',
	upload.single('image'),
	userController.uploadUserAvatar
)

module.exports = router
