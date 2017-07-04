const port = process.env.PORT || 80
//--
const http = require('http'),
	express = require('express'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  path = require('path'),
  io = require('./socket')

const app = express()

const index = require('./routes/index')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', index)

var server = http.createServer(app)

io.attach(server)

server.listen(port, () => {
	console.log(`Server listening at http://127.0.0.1:${port}`)
})
