const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const serveStatic = require('serve-static')
const errorHandler = require('errorhandler')
const expressErrorHandler = require('express-error-handler')
const cors = require('cors')
const expressSession = require('express-session')
const loader = require('./Server/Web/routes')
const klog = require('korean-logger')
const Ddos = require('ddos')
const ddos = new Ddos({burst:10, limit:15, responseStatus:429, errormessage:'429 Too Many Requests', whitelist:["enter_your_ip"], maxexpiry:120})

const app = express()
const router = express.Router()
const port = 80

app.set('views', path.join(__dirname, 'Server/Web/views'))
app.set('view engine', 'pug')
        
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(ddos.express)
app.use('/', serveStatic(path.join(__dirname, 'Server/Web/public')))
app.use(cookieParser())
app.use(expressSession({
  secret: '!@#$%!^#!&^#&!',
  resave: true,
  aveUninitialized: true
}))

loader.init(app, router)
        
const errorhandler = expressErrorHandler({
  static: {
    '404': './Server/Web/public/404.html'
  }
})
        
app.use(expressErrorHandler.httpError(404))
app.use(errorhandler)

http.createServer(app).listen(port, () => {
  klog.success('웹서버가 정상적으로 가동되었습니다.')
})