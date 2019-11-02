const express = require('express')
const scgController = require('./controllers/SCG')
const app = express()

app.set('view engine', 'pug')

app.get('/',  scgController.findingXYZ)

app.listen(3000)