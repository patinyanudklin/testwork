require('dotenv').config()
const express = require('express')
const scgController = require('./controllers/SCG')
const line = require('@line/bot-sdk')
const app = express()

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET,
}

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/findrestaurant',  scgController.findingRestaurantsInBangsue)
app.get('/', scgController.findingXYZ)
app.post('/webhook', line.middleware(config), scgController.lineWebHook)

const PORT = process.env.PORT || 3000

app.listen(PORT)