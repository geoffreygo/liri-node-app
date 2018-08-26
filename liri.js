require("dotenv").config();

var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var spotify = new spotify(keys.spotify);
var request = require("request");
var moment = require("moment");
var dotenv = require("dotenv");

switch (process.argv[2]) {
    case "concert-this":
    var band = process.argv.slice(3).join(" ");
    console.log(band);

    request("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp", function(err, response, body) {
        console.log("in request");
        if (!err && response.statusCode === 200) {
            // console.log(JSON.parse(body));
            var concert = JSON.parse(body);
            concert.forEach(element => {
                console.log(element.venue.name);
                console.log(element.venue.city + " " + element.venue.region + " " + element.venue.country);
                console.log(moment(element.datetime).format("MM/DD/YYYY"),"\n");
            });
        }
    })
    break;
    case "spotify-this-song":
    var song = process.argv.slice(3).join("+");
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data); 
      });
}