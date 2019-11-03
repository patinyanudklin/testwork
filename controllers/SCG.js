const request = require('request')
const math = require('mathjs')
const line = require('@line/bot-sdk')

const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET,
}


/*
	Find 2nd degree polynomial formula using matrix
	ref: https://www.geeksforgeeks.org/finding-nth-term-polynomial-sequence/
	Input: 
		- any 3 consecutive terms of the 2nd degree polynomial sequence
		- first of the consecutive terms 
	Example:
		s2, s3, s4, ... = 5, 9, 15, ...
		find formula using s2, s3, s4 by calling get2ndDgPolynomialFormula(5, 9, 15, 2)
*/
var get2ndDgPolynomialFormula = function( s1, s2, s3, firstTerm)
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
		// formula of the input 2nd degree polynomial sequence
		return result._data[0][0] + n*result._data[1][0] + n*n*result._data[2][0]
	}

	return Sn
}

exports.findingXYZ = function(req, res){
	let nForm = get2ndDgPolynomialFormula(5,9,15, 2)
	const x = 1, 
	y = 6, 
	z = 7
	console.log(`x = ${nForm(x)}`) 
	console.log(`y = ${nForm(y)}`)
	console.log(`z = ${nForm(z)}`)
	res.send("under construction")
}

exports.findingRestaurantsInBangsue = function(req, res){
	//const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3&inputtype=textquery&fields=formatted_address,geometry,icon,name,types&locationbias=rectangle:13.797062,100.505889|13.849573,100.545197&key=AIzaSyDr6n-dNDoMM8PavoXgwKxBofT8Rez0Z7A'
	
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
			let jsonResult = JSON.parse(body);
			let output = JSON.stringify(jsonResult, null, 4)
			res.render('mainpage', {output})
		}
		res.send('Error!')
	})
}

exports.lineWebHook = function(req, res){
	Promise
		.all(req.body.events.map(handleEvent))
    	.then((result) => res.json(result))
}

const client = new line.Client(config)
function handleEvent(event) {
	if (event.type !== 'message' || event.message.type !== 'text') {
		return Promise.resolve(null)
  	}

	return client.replyMessage(event.replyToken, {
		type: 'text',
		text: event.message.text
	})
}