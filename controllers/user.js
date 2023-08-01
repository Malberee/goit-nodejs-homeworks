const User = require('../models/user')
const Jimp = require('jimp')
const path = require('path')
const fs = require('fs/promises')

const getUserById = async (req, res, next) => {
	const user = await User.findById(req.params.userId)

	if (user === null) {
		return res.status(404).json({ message: 'User not found' })
	}

	return res.status(200).json(user)
}

const uploadUserAvatar = async (req, res, next) => {
	const { path: imagePath, originalname } = req.file
	const { userId } = req.params

	Jimp.read(imagePath)
		.then((avatar) => {
			return avatar.resize(250, 250).quality(60).write(imagePath)
		})
		.catch((err) => {
			console.error(err)
		})

	const newFileName = `${userId}-${originalname}`
	const publicPath = path.join(path.resolve('tmp'), newFileName)

	await fs.rename(imagePath, publicPath)

	const avatarURL = path.join('avatars', newFileName)

	try {
		const result = await User.findByIdAndUpdate(
			userId,
			{ avatarURL },
			{ new: true }
		).select({ avatarURL: 1, subscription: 1, email: 1 })

		if (result === null) {
			return res.status(404).json({ message: 'User not found' })
		}

		return res.status(200).json(result)
	} catch (err) {
		next(err)
	}
}

module.exports = {
	getUserById,
	uploadUserAvatar,
}
