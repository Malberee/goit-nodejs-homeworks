const express = require('express')
const contactsController = require('../../controllers/contacts')

const router = express.Router()

router.get('/', contactsController.listContacts)

router.get('/:contactId', contactsController.getContactById)

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
