let path = require('path')
let express = require('express')
let app = express()
let messages = [
  {text: 'hey', lang: 'english'},
  {text: 'isänme', lang: 'tatar'},
  {text: 'hej', lang: 'swedish'}
]
app.use(express.static('public'))
let ProtoBuf = require('protobufjs')
let builder = ProtoBuf.loadProtoFile(path.join(__dirname, 'message.proto'))
let Message = builder.build('Message')

app.get('/api/messages', (req, res, next)=>{
  let msg = new Message(messages[Math.round(Math.random()*3)])
  // res.end(msg.toBuffer(), 'binary')
  res.send(msg.toBuffer())
  // res.end(Buffer.from(msg.toArrayBuffer()), 'binary')
})

app.post('/api/messages', (req, res, next)=>{
  // if (flags.binary) {
    try {
        // Decode the Message
        var msg = Message.decode(data)
        console.log("Received: "+msg.text)
        // Transform the text to upper case
        msg.text = msg.text.toUpperCase()
        // Re-encode it and send it back
        socket.send(msg.toBuffer())
        console.log("Sent: "+msg.text)
    } catch (err) {
        console.log("Processing failed:", err)
        next(err)
    }
  // } else {
      // console.log("Not binary data");
  // }
})

app.all('*', (req, res)=>{
  res.status(400).send('Not supported')
})

app.listen(3000)