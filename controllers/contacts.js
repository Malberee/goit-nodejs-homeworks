const listContacts = async (req, res) => {
	return res.json({ message: 'text' })
}

const getContactById = async (req, res) => {
	return res.json({ message: `${req.params.contactId}` })
}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
}
