const express = require('express')
const contactSchema = require('../../schemas/contacts')
const {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
} = require('../../models/contacts')

const router = express.Router()

const jsonParser = express.json()

router.get('/', async (req, res) => {
	const contacts = await listContacts()
	res.json(contacts)
})

router.get('/:contactId', async (req, res) => {
	const contact = await getContactById(req.params.contactId)
	res.json(contact)
})

router.post('/', jsonParser, async (req, res) => {
	const schema = contactSchema.validate(req.body)

	if (schema.error !== undefined) {
		return res.status(400).json({ message: schema.error.message })
	}

	const { name, email, phone } = req.body
	const newContact = await addContact(name, email, phone)

	res.status(201).json(newContact)
})

router.delete('/:contactId', async (req, res) => {
	const contact = await removeContact(req.params.contactId)

	if (!contact) res.status(404).json({ message: 'Not found' })

	res.json({ message: 'Contact deleted' })
})

router.put('/:contactId', jsonParser, async (req, res) => {
	const schema = contactSchema.validate(req.body)

	if (schema.error !== undefined) {
		return res.status(400).json({ message: schema.error.message })
	}

	const contact = await updateContact(req.params.contactId, req.body)
	
	res.json(contact)
})

module.exports = router
