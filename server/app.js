import express from 'express'
import cors from 'cors'
import usersRouter from './routes/users.js'
import { handle404 } from './middleware/errorHandlers.js'
import connectDB from './config/database.js'

const app = express()
const port = 8000

connectDB()

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json())
app.use('/users', usersRouter)
app.use(handle404)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})