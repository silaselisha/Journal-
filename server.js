const colors = require('colors')
const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/.env` })

process.on('uncaughtException', (err) => {
    console.log(colors.america(`${err.message}`))
    console.log(colors.america(`Server shutting down!`))
    process.exit(1)
})

const app = require('./index')


const port = process.env.PORT || 4000
const localhost = `127.0.0.1`


const server = app.listen(port, () => {
    console.log(colors.magenta.inverse(`Listening http://${localhost}/${port}`))
})

process.on('unhandledRejection', () => {
    server.close((err) => {
        console.log(colors.red.inverse(`${err}`))
        console.log(colors.america('Server shutting down!'))
        process.exit(1)
    })
})