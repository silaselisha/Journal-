const fs = require('fs')
const colors = require('colors')
const catchAsync = require('../utils/catchAsync')
const JournalError = require('../utils/appError')

let journalsData = JSON.parse(fs.readFileSync(`${__dirname}/../_data/data/journals.json`, 'utf-8'))


exports.getJournals = catchAsync(async (req, res, next) => {
    const journals = journalsData

    res.status(200).json({
        status: 'success',
        results: journals.length,
        data: {
            data: journals
        }
    })
})

exports.getJournal = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const journal = journalsData.find(journal => journal._id === id)

    if(!journal) {
        return next(new JournalError(`Journal with ${id} was not found!`, 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: journal
        }
    })
})

exports.createJournal = catchAsync(async (req, res, next) => {
    const newJournal = {
        '_id': `journal000${journalsData.length + 1}`,
        title: req.body.title,
        description: req.body.description,
        summary: req.body.summary,
        date: new Date(req.body.date),
        createdAt: new Date(Date.now())
    }

    if(!newJournal) {
        return next(new JournalError(`New journal could not be created..!`), 400)
    }

    journalsData.push(newJournal)

    fs.writeFile(`${__dirname}/../_data/data/journals.json`, 
    JSON.stringify(journalsData), (err) => {
        if(err) {
            return next(new JournalError(`${err.message}`, 400))
        }
        console.log(colors.inverse('Data successfully uploaded'))
    })

    res.status(201).json({
        status: 'success',
        data: {
            data: newJournal
        }
    })
})

exports.updateJournal = catchAsync(async (req, res, next) => {
    const id = req.params.id

    let journal = journalsData.find(journal => journal._id === id)

    if(!journal) {
        return next(new JournalError(`Journal with the provided id ${id} was not found!`, 404))
    }


    let { title, description, summary, date } = req.body;

    if(title == null) title = journal.title
    if(date == null) date = journal.date
    if(description == null) description = journal.description
    if(summary == null) summary = journal.summary

    const index = journalsData.findIndex((journal) => journal._id === id)
  

    const updatedJounal = {
      _id: journal._id,
      title,
      description,
      summary,
      date,
      createdAt: journal.createdAt,
      updatedAt: new Date(Date.now()),
    };

    journalsData.splice(index, 1, updatedJounal);

    fs.writeFile(
        `${__dirname}/../_data/data/journals.json`,
        JSON.stringify(journalsData),
        (err) => {
        if (err) {
            return next(new JournalError(`${err.message}`, 400));
        }
        console.log(colors.inverse("Data successfully updated"));
        }
    );

    res.status(200).json({
        status: 'success',
        data: {
            data: updatedJounal
        }
    })
})

exports.deleteJournal = catchAsync(async (req, res, next) => {
    const id = req.params.id

    const journal = journalsData.find(journal => journal._id === id)

    if(!journal) {
        return next(new JournalError(`Could not find a journal with the provide id ${id}`, 404))
    }


    journalsData = journalsData.filter(journal => journal._id !== id)

    fs.writeFile(
      `${__dirname}/../_data/data/journals.json`,
      JSON.stringify(journalsData),
      (err) => {
        if (err) {
          return next(new JournalError(`${err.message}`, 400));
        }
        console.log(colors.inverse("Journal successfully deleted"));
      }
    );

    res.status(204).json({
        status: 'success',
        data: null
    })
})
