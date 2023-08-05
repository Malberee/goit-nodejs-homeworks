const express = require('express')
const authController = require('../../controllers/auth')

const auth = require('../../middlewares/auth')

const router = express.Router()

const jsonParser = express.json()

router.post('/users/register', jsonParser, authController.registerUser)

router.get('/users/verify/:verificationToken', authController.verificationUser)

router.post('/users/verify', authController.reVerificationUser)

router.post('/users/login', jsonParser, authController.loginUser)

router.post('/users/logout', auth, authController.logoutUser)

router.get('/users/current', auth, authController.currentUser)

module.exports = router
