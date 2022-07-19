const express = require('express')

const { getJournals, getJournal, createJournal, updateJournal, deleteJournal } = require('../controllers/journalController')

const router = express.Router()

router.route('/')
        .get(getJournals)
        .post(createJournal)

router.route('/:id')
        .get(getJournal)
        .patch(updateJournal)
        .delete(deleteJournal)

module.exports = router