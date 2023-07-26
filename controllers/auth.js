const User = require('../models/user')

const registerUser = async (req, res, next) => {
	const { name, email, password } = req.body

	try {
		const result = await User.create({ name, email, password })

		console.log(result)

		res.status(201).json({
			message: 'You are now registered',
		})
	} catch (err) {
		console.log(err)
	}
}

module.exports = {
	registerUser,
}
