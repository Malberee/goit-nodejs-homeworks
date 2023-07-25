const express = require('express')
const contactsController = require('../../controllers/contacts')

const router = express.Router()

const jsonParser = express.json()

router.get('/', contactsController.listContacts)

router.get('/:contactId', contactsController.getContactById)

router.post('/', jsonParser, contactsController.addContact)

router.delete('/:contactId', contactsController.removeContact)

router.put('/:contactId', jsonParser, contactsController.updateContact)

router.patch('/:contactId/favorite', jsonParser, contactsController.updateStatusContact)

module.exports = router
