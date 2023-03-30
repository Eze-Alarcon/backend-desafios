'use strict'
/* eslint space-before-function-paren: 0 */

// Libraries
import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

// Routers
import { productsRouter } from './routers/productsRouter.js'
import { cartRouter } from './routers/cartRouter.js'
import { viewsRouter } from './routers/viewsRouter.js'

// Middlewares
import { handleError } from './middleware/errors.js'
import { socketHandle } from './middleware/socket.js'

const PORT = 8080

const app = express()
app.use('/static', express.static('./static'))

app.engine('handlebars', engine())
app.set('views', './views')

app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/', viewsRouter)
app.use(handleError)

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
  console.log('Path to static view: ', 'http:localhost:8080/')
  console.log('Path to dinamic view: ', 'http:localhost:8080/realtimeproducts”')
  console.log('Path to API: ', 'http:localhost:8080/api/products')
})

export const io = new Server(server)

io.on('connection', async clientSocket => {
  console.log(`Nuevo cliente conectado: ${clientSocket.id}`)
  await socketHandle()
})

// import mongoose, { Schema } from 'mongoose'

// const USER = 'tutorCoderhouse'
// const PASS = 'tutorPassword'
// const DB = 'ecommerce'

// const url = `mongodb+srv://${USER}:${PASS}@coderhousecluster0.vsmyvjt.mongodb.net/${DB}`

// await mongoose.connect(url)

// const studentsSchema = new Schema({
//   name: { type: String, required: true },
//   age: { type: Number, min: 0 }
// })

// const students = mongoose.model('estudiantes', studentsSchema)

// await students.deleteMany()

// await students.create({
//   name: 'ezequiel',
//   age: 24
// })

// const allStudents = await students.find()

// console.log(allStudents)
