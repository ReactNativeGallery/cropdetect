const express = require('express')
const { cropdetect } = require('./cropdetect')

const { PORT } = process.env

const app = express()
app.use(require('body-parser').json({ limit: '10mb' }))

app.post('/', (req, res) => {
  const result = cropdetect(req.body.data)

  if (!result) {
    res.status(500).send({ error: 'result is empty' })
  }

  if (result && result.error) {
    res.status(500).send({ ...result })
  }

  res.status(202).send({ ...result })
});

app.listen(PORT || 3000, () => {
  console.log('listening on port 3000!')
});