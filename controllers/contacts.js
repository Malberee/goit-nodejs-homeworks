const Contact = require('../models/contact')

const listContacts = async (req, res, next) => {
	try {
		const result = await Contact.find()

		return res.json(result)
	} catch (err) {
		return next(err)
	}
}

const getContactById = async (req, res, next) => {
	const { contactId } = req.params

	try {
		const result = await Contact.findById(contactId)

		if (result === null) return res.status(404).send('Contact not found')

		return res.json(result)
	} catch (err) {
		return next(err)
	}
}

const removeContact = async (req, res, next) => {
	const { contactId } = req.params

	try {
		const result = await Contact.findByIdAndRemove(contactId)

		if (result === null) return res.status(404).send('Contact not found')

		return res.status(204).end()
	} catch (err) {
		return next(err)
	}
}

const addContact = async (req, res, next) => {
	const { name, email, phone } = req.body
	const contact = {
		name,
		email,
		phone,
		favorite: false,
	}

	try {
		const result = await Contact.create(contact)

		return res.status(201).json(result)
	} catch (err) {
		return next(err)
	}
}

const updateContact = async (req, res, next) => {
	const { contactId } = req.params
	const { name, email, phone } = req.body
	const contact = {
		name,
		email,
		phone,
		favorite: false,
	}

	try {
		const result = await Contact.findByIdAndUpdate(contactId, contact, {
			new: true,
		})

		if (result === null) return res.status(404).send('Contact not found')

		return res.json(result)
	} catch (err) {
		return next(err)
	}
}

const updateStatusContact = async (req, res, next) => {
	const { contactId } = req.params
	const { favorite } = req.body

	try {
		const result = await Contact.findOneAndUpdate(
			{ _id: contactId },
			{ favorite },
			{ new: true }
		)

		if (result === null) return res.status(404).send('Contact not found')

		return res.json(result)
	} catch (err) {
		return next(err)
	}
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
	updateStatusContact,
}