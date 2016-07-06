"use strict"

let path = require('path')
let express = require('express')
let app = express()
let messages = [
  {text: 'hey', lang: 'english'},
  {text: 'isänme', lang: 'tatar'},
  {text: 'hej', lang: 'swedish'}
]
let publicFolderName = 'public'
app.use(express.static(publicFolderName))
app.use (function(req, res, next) {
  if (!req.is('application/octet-stream')) return next()
  var data = [] // List of Buffer objects
  req.on('data', function(chunk) {
      data.push(chunk) // Append Buffer object
  })
  req.on('end', function() {
    if (data.length <= 0 ) return next()
    data = Buffer.concat(data) // Make one large Buffer of it
    console.log('Received buffer', data)
    req.raw = data
    next()
  })
})
let ProtoBuf = require('protobufjs')
let builder = ProtoBuf.loadProtoFile(
  path.join(__dirname,
  publicFolderName,
  'message.proto')
)
let Message = builder.build('Message')

app.get('/api/messages', (req, res, next)=>{
  let msg = new Message(messages[Math.round(Math.random()*2)])
  console.log('Encode and decode: ',
    Message.decode(msg.encode().toBuffer()))
  console.log('Buffer we are sending: ', msg.encode().toBuffer())
  // res.end(msg.encode().toBuffer(), 'binary') // alternative
  res.send(msg.encode().toBuffer())
  // res.end(Buffer.from(msg.toArrayBuffer()), 'binary') // alternative
})

app.post('/api/messages', (req, res, next)=>{
  if (req.raw) {
    try {
        // Decode the Message
      var msg = Message.decode(req.raw)
      console.log('Received "%s" in %s', msg.text, msg.lang)
    } catch (err) {
      console.log('Processing failed:', err)
      next(err)
    }
  } else {
    console.log("Not binary data")
  }
})

app.all('*', (req, res)=>{
  res.status(400).send('Not supported')
})

app.listen(3000)
