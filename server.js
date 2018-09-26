const express = require('express')
const { cropdetect, getImageBufferAsync, decodeFromBase64 } = require('./cropdetect')

const { PORT } = process.env

const app = express()
app.use(require('body-parser').json({ limit: '10mb' }))

app.get('/', (req, res) => res.status(200).send('ok'))

app.post('/', async (req, res) => {

  let result
  if (req.body.data) {
    result = cropdetect(decodeFromBase64(req.body.data))
  } else if(req.body.url) {
    const data = await getImageBufferAsync(req.body.url)
    console.log(data)
    result = cropdetect(data)
  } else {
    res.status(400).send({ error: 'unknown property, known properties are "data" or "url"' })
    return
  }

  if (!result) {
    res.status(500).send({ error: 'result is empty' })
    return
  }

  if (result && result.error) {
    res.status(500).send({ ...result })
    return
  }

  res.status(202).send({ ...result })
});

app.listen(PORT || 3000, () => {
  console.log('listening on port 3000!')
});