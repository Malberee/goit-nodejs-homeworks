const express = require('express')
const authController = require('../../controllers/auth')

const router = express.Router()

const jsonParser = express.json()

router.post('/users/register', jsonParser, authController.registerUser)

router.post('/users/login', jsonParser, async (req, res, next) => {
	res.json({ message: 'template message' })
})

router.post('/users/logout', jsonParser, async (req, res, next) => {
	res.json({ message: 'template message' })
})

router.get('/users/current', async (req, res, next) => {
	res.json({ message: 'template message' })
})

module.exports = router
