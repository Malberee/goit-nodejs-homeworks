const jwt = require('jsonwebtoken')

const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET

function auth(req, res, next) {
	const authHeader = req.headers.authorization

	if (typeof authHeader !== 'string') {
		return res.status(401).json({ error: 'No token provided' })
	}

	const [bearer, token] = authHeader.split(' ', 2)

	if (bearer !== 'Bearer') {
		return res.status(401).json({ error: 'No token provided' })
	}

	jwt.verify(token, JWT_SECRET, async (err, decode) => {
		if (err) {
			if (
				err.name === 'TokenExpiredError' ||
				err.name === 'JsonWebTokenError'
			) {
				return res.status(401).json({ error: 'Token Error' })
			}

			return next(err)
		}

		try {
			const user = await User.findById(decode.id)

			if (!user || !user.token || user.token !== token) {
				return res.status(401).json({ error: 'Token Error' })
			}

			if (!user.verify) {
				return res.status(401).json({ error: 'Token Expired' })
			}

			req.user = { id: decode.id }

			next()
		} catch (err) {
			return next(err)
		}
	})
}

module.exports = auth
