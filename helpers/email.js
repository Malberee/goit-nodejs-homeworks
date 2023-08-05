const nodemailer = require('nodemailer')

const sendEmail = async (message) => {
	const transporter = nodemailer.createTransport({
		host: 'sandbox.smtp.mailtrap.io',
		port: 2525,
		auth: {
			user: process.env.MAILTRAP_USER,
			pass: process.env.MAILTRAP_PASS,
		},
	})

	message['from'] = 'pavellyalkov45@gmail.com'

	return transporter
		.sendMail(message)
		.then((res) => console.log(res))
		.catch((err) => console.error(err))
}

module.exports = { sendEmail }
