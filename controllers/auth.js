const bcrypt = require('bcrypt')

const User = require('../models/user')

const registerUser = async (req, res, next) => {
	const { name, email, password } = req.body

	try {
		const user = await User.findOne({ email })

		if (user !== null) {
			return res.status(409).json({ message: 'User already exists' })
		}

		const passwordHash = await bcrypt.hash(password, 10)

		const result = await User.create({ name, email, password: passwordHash })

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

		return res.status(200).json({ token: 'TOKEN' })
	} catch (err) {
		return next(err)
	}
}

module.exports = {
	registerUser,
	loginUser,
}
