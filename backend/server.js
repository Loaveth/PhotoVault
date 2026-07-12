import express from 'express'
import cors from 'cors'
import * as data from './data.js'
import router from './routers/index.js'
import { authMiddleware } from './routers/auth.js'

const app = express()

app.use(express.json())

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}))

data.applySchema()

app.use(authMiddleware)

app.use('/images', express.static('photos'))

app.use(router)

if (process.env.ALLOW_RESET_DATABASE) {
  app.put('/reset_database', (req, res) => {
    data.dropAllTables()
    data.applySchema()
    res.json({})
  })
}

app.listen(3000, () => {
    console.log('Server running on port 3000')
})