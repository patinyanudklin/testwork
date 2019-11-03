const express = require('express')
const scgController = require('./controllers/SCG')
const app = express()

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/findrestaurant',  scgController.findingRestaurantsInBangsue)
app.get('/', scgController.findingXYZ)

const PORT = process.env.PORT || 3000

app.listen(PORT)