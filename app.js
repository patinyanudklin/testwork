const express = require('express')
const scgController = require('./controllers/SCG')
const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/',  scgController.findingRestaurantsInBangsue)

app.listen(3000)