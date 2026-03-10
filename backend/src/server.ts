import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { generateApologyRouter } from './routes/generateApology.js'

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000']

app.use(cors({
  origin: allowedOrigins,
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

app.use('/', generateApologyRouter)

app.listen(PORT, () => {
  console.log(`🪿 Apologizer backend running on http://localhost:${PORT}`)
})
