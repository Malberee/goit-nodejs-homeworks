const Contact = require('../models/contact')

const listContacts = async (req, res, next) => {
	try {
		const result = await Contact.find({ owner: req.user.id })

		return res.json(result)
	} catch (err) {
		return next(err)
	}
}

const getContactById = async (req, res, next) => {
	const { contactId } = req.params

	try {
		const result = await Contact.findOne({ _id: contactId, owner: req.user.id })

		if (result === null) return res.status(404).send('Contact not found')

		return res.json(result)
	} catch (err) {
		return next(err)
	}
}

const removeContact = async (req, res, next) => {
	const { contactId } = req.params

	try {
		const result = await Contact.findOneAndRemove({
			_id: contactId,
			owner: req.user.id,
		})

		if (result === null) {
			return res.status(404).send('Contact not found')
		}

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
		owner: req.user.id,
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
		const result = await Contact.findOneAndUpdate(
			{ _id: contactId, owner: req.user.id },
			contact,
			{
				new: true,
			}
		)

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
			{ _id: contactId, owner: req.user.id },
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
