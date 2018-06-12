const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const port = process.env.PORT || 8080
let app = express()

app.use(serveStatic(path.join(__dirname, 'dist')))
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  res.send('Test')
})
app.listen(port, () => {
  console.log(`Server is start on port ${port}`)
})
