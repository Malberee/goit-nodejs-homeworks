const express = require('express')
const {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
} = require('../../models/contacts')

const router = express.Router()

router.get('/', async (req, res, next) => {
	const contacts = await listContacts()
	res.json(contacts)
})

router.get('/:contactId', async (req, res, next) => {
	console.log(req.query)
	const contacts = await listContacts()
	const foundContact = contacts.find(
		(contact) => contact.id === req.params.contactId
	)
	res.json(foundContact)
})

router.post('/', async (req, res, next) => {
  const {name, email, phone} = req.body
	if (Object.keys(req.body).length < 3) {
		res.status(400).json({ message: 'missing required name field' })
		return
	}

	const newContact = await addContact(name, email, phone)

	res.status(201).json(newContact)
})

router.delete('/:contactId', async (req, res, next) => {
	const contact = await removeContact(req.params.contactId)

	if (!contact) res.status(404).json({ message: 'Not found' })

	res.json({ message: 'Contact deleted' })
})

router.put('/:contactId', async (req, res, next) => {
	const contact = await updateContact(req.params.contactId, req.body)
	res.json({ message: 'template message' })
})

module.exports = router
