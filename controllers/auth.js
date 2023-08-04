const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const { sendEmail } = require('../helpers/email')

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
		const verificationToken = uuidv4()

		await User.create({
			email,
			password: passwordHash,
			avatarURL,
			verificationToken,
		})

		await sendEmail({
			to: email,
			subject: 'Welcome!',
			html: `To confirm your account, please click on the link below: <a href="http://localhost:3000/api/auth/users/verify/${verificationToken}">Click to confirm</a>`,
			text: `To confirm your account, please click on the link below: http://localhost:3000/api/auth/users/verify/${verificationToken}`,
		})

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

		if (!user.verify) {
			return res
				.status(401)
				.json({ message: 'Please verify your account first' })
		}

		const token = jwt.sign({ id: user._id }, JWT_SECRET)

		await User.updateOne({ _id: user._id }, { $set: { token } })

		return res.status(200).json({ token })
	} catch (err) {
		return next(err)
	}
}

const logoutUser = async (req, res, next) => {
	const { id } = req.user

	try {
		await User.findOneAndUpdate({ _id: id }, { $set: { token: null } })

		return res.status(200).json({ message: 'You are logged out' })
	} catch (err) {
		next(err)
	}
}

const currentUser = async (req, res, next) => {
	const { id } = req.user

	try {
		const result = await User.findById(id)

		console.log(result)

		res.status(200).json(result)
	} catch (err) {
		next(err)
	}
}

const verificationUser = async (req, res, next) => {
	const { verificationToken } = req.params

	try {
		const result = await User.findOne({ verificationToken })

		if (result === null) {
			return res.status(401).json({ message: 'Invalid token' })
		}

		await User.findByIdAndUpdate(result._id, {
			verify: true,
			verificationToken: null,
		})

		return res.status(200).json({ message: 'User verified' })
	} catch (err) {
		next(err)
	}
}

const reVerificationUser = async (req, res, next) => {
	const { email } = req.body

	if (!email) {
		res.status(400).json({ message: 'Missing required field' })
	}

	try {
		const user = await User.findOne({ email })

		if (user === null) {
			return res.status(401).json({ message: 'Email is incorrect' })
		}

		if (user.verify) {
			return res
				.status(400)
				.json({ message: 'Verification has already been passed' })
		}

		const verificationToken = uuidv4()

		await User.findOneAndUpdate({ email }, { verificationToken })

		await sendEmail({
			to: email,
			subject: 'Welcome!',
			html: `To confirm your account, please click on the link below: <a href="http://localhost:3000/api/auth/users/verify/${verificationToken}">Click to confirm</a>`,
			text: `To confirm your account, please click on the link below: http://localhost:3000/api/auth/users/verify/${verificationToken}`,
		})

		return res.status(200).json({ message: 'Verification email sent' })
	} catch (err) {
		next(err)
	}

	console.log(email)
}

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	currentUser,
	verificationUser,
	reVerificationUser,
}
