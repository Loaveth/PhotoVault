import express from 'express'

const router = express.Router()

const clients = []

router.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  res.flushHeaders()

  clients.push(res)

  req.on('close', () => {
    const index = clients.indexOf(res)

    if (index !== -1) {
      clients.splice(index, 1)
    }
  })
})

function sendEvent(data) {
  clients.forEach((client) => {
    client.write(`data: ${data}\n\n`)
  })
}

export default router
export { sendEvent }