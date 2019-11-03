const request = require('request')
const math = require('mathjs')
const line = require('@line/bot-sdk')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended:true})

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET,
}

/*
	Find 2nd order polynomial formula using matrix
	ref: https://www.geeksforgeeks.org/finding-nth-term-polynomial-sequence/
	Input: 
		- any 3 consecutive terms of the 2nd order polynomial sequence
		- first of the consecutive terms 
	Example:
		s2, s3, s4, ... = 5, 9, 15, ...
		find formula using s2, s3, s4 by calling get2ndDgPolynomialFormula(5, 9, 15, 2)
*/
var get2ndOrderPolynomialFormula = function( s1, s2, s3, firstTerm)
{
	// using matrix to calculate
	const A = math.matrix([
		[1, firstTerm, firstTerm*firstTerm],
		[1, firstTerm+1, (firstTerm+1)*(firstTerm+1)],
		[1, firstTerm+2, (firstTerm+2)*(firstTerm+2)]])
	let B = math.matrix([[s1],[s2],[s3]])

	// inverse matrix A
	let invA = math.inv(A)
	// inv A x B
	let result = math.multiply(invA, B)

	// return function that get the number of term, then return the value of that term regarding the normal form.
	let Sn = function (n){
		// formula of the input 2nd order polynomial sequence
		return result._data[0][0] + n*result._data[1][0] + n*n*result._data[2][0]
	}

	return Sn
}

exports.findingXYZ = function(req, res){

	let {s1,s2,s3, ft} = req.query
	if(typeof s1 == 'undefined' || typeof s2 == 'undefined' || typeof s3 == 'undefined' || typeof ft == 'undefined')
	{
		const result = ``
		res.render('findxyz', {result})
	}
	let nForm = get2ndOrderPolynomialFormula(parseInt(s1),parseInt(s2),parseInt(s3), parseInt(ft)) 
	// term
	const x = 1, 
	y = 6, 
	z = 7

	// term
	const t = parseInt(ft)
	const result = `sequence where s${t}, s${t+1}, s${t+2} = ${s1}, ${s2}, ${s3} | x = ${nForm(x)}, y = ${nForm(y)}, z = ${nForm(z)}`
	res.render('findxyz', {result})
}

exports.findingRestaurantsInBangsue = function(req, res){
	
	// Key
	const googleAPIKey = process.env.GOOGLE_API_KEY
	// Bangsue location
	const lat = '13.825820'
	const long = '100.523141'
	// meters
	const radius = '3500' 
	// Nearby Search
	const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=${radius}&type=restaurant&key=${googleAPIKey}`
	
	request(url, function(error, response, body){
		if(!error&& response.statusCode == 200){
			let output = JSON.parse(body);
			//let output = JSON.stringify(jsonResult, null, 4)
			res.render('restaurant', {output})
		}
		else
			res.send('Error!')
	})
}

exports.lineWebHook = async function(req, res){
	Promise
		.all(req.body.events.map(handleEvent))
	    .then((result) => res.json(result))
	    .catch((err) => {
	      console.error(err)
	      res.status(500).end()
    })
}

const client = new line.Client(config)

function handleEvent(event) {
	if (event.type !== 'message' || event.message.type !== 'text') {
		return Promise.resolve(null)
  	}

  	let reply = event.message.text
  	if(event.message.text.includes("Shiorin"))
  		reply = "Oh! You remembered my name!"
  	if(event.message.text.includes("Sad"))
  		reply = "一緒に頑張りましょうね！"
	
	// create a  message
  	const echo = { type: 'text', text: reply }

  	// use reply API
  	return client.replyMessage(event.replyToken, echo)
}