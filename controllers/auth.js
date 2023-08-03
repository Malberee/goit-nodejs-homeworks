const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res, next) => {
	const { email, password } = req.body

	try {
		const user = await User.findOne({ email })

		if (user !== null) {
			return res.status(409).json({ message: 'User already exists' })
		}

		const passwordHash = await bcrypt.hash(password, 10)

		const avatarURL = gravatar.url(email)

		const result = await User.create({
			email,
			password: passwordHash,
			avatarURL,
		})

		console.log(result)

		return res.status(201).json({
			message: 'You are now registered',
		})
	} catch (err) {
		return next(err)
	}
}

const loginUser = async (req, res, next) => {
	const { email, password } = req.body

	try {
		const user = await User.findOne({ email })

		if (user === null) {
			return res.status(401).json({ message: 'Email or password is incorrect' })
		}

		const isMatch = await bcrypt.compare(password, user.password)

		if (!isMatch) {
			return res.status(401).json({ message: 'Email or password is incorrect' })
		}

		const token = jwt.sign({ id: user._id }, JWT_SECRET)

		await User.updateOne({ _id: user._id }, { $set: { token } })

		return res.status(200).json({ token })
	} catch (err) {
		return next(err)
	}
}

const logoutUser = async (req, res, next) => {
	try {
		await User.findOneAndUpdate({ _id: req.user.id }, { $set: { token: null } })

		return res.status(200).json({ message: 'You are logged out' })
	} catch (err) {
		next(err)
	}
}

const currentUser = async (req, res, next) => {
	try {
		const result = await User.findById(req.user.id)

		console.log(result)

		res.status(200).json(result)
	} catch (err) {
		next(err)
	}
}

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	currentUser,
}
