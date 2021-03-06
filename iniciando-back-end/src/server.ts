import express, { NextFunction, Request, Response } from 'express'

import 'express-async-errors'

import uploadConfig from './config/upload'
import AppError from './errors/AppError'
import routes from './routes'

import './database'

const app = express()

app.use(express.json())
app.use('/files', express.static(uploadConfig.directory))
app.use(routes)

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', error: err.message })
  }

  console.log(err)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

app.listen(3333, () => {
  console.log('🚀 Server started on http://localhost:3333')
})
