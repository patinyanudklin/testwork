const request = require('request')
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

exports.findingXYZ = function(req, res){
	res.render("mainpage")
}

exports.findingRestaurantsInBangsue = function(req, res){
	//const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3&inputtype=textquery&fields=formatted_address,geometry,icon,name,types&locationbias=rectangle:13.797062,100.505889|13.849573,100.545197&key=AIzaSyDr6n-dNDoMM8PavoXgwKxBofT8Rez0Z7A'
	// Nearby Search
	const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=13.825820,100.523141&radius=3500&type=restaurant&key=AIzaSyDr6n-dNDoMM8PavoXgwKxBofT8Rez0Z7A'
	
	request(url, function(error, response, body){
		if(!error&& response.statusCode == 200){
			let jsonResult = JSON.parse(body);
			let jsonText = JSON.stringify(jsonResult, null, 4)
			//console.log(jsonResult);
			//res.render("mainpage", {body})
			res.render('mainpage', {jsonText})
		}
	})
	//console.log("ddd"+jsonResult)
	//request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=13.825820,100.523141&radius=3500&type=restaurant&key=AIzaSyDr6n-dNDoMM8PavoXgwKxBofT8Rez0Z7A')
}