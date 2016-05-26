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
let ProtoBuf = require('protobufjs')
let builder = ProtoBuf.loadProtoFile(path.join(__dirname, publicFolderName, 'message.proto'))
let Message = builder.build('Message')

app.get('/api/messages', (req, res, next)=>{
  let msg = new Message(messages[Math.round(Math.random()*2)])
  // res.end(msg.toBuffer(), 'binary')

  // console.log(msg, msg.encode(), msg.encode().toBuffer());

  console.log(msg.encode().toBuffer());
  console.log(Message.decode(msg.encode().toBuffer()));
  // res.end(msg.encode().toBuffer(), 'binary')
  res.send(msg.encode().toBuffer())
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