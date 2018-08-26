require("dotenv").config();

var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var spotify = new spotify(keys.spotify);
var request = require("request");
var moment = require("moment");
var fs = require("fs");

switch (process.argv[2]) {
    case "concert-this":
        var band = process.argv.slice(3).join(" ");
        console.log(band);

        request("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp", function (err, response, body) {
            console.log("in request");
            if (!err && response.statusCode === 200) {
                // console.log(JSON.parse(body));
                var concert = JSON.parse(body);
                concert.forEach(element => {
                    console.log(element.venue.name);
                    console.log(element.venue.city + " " + element.venue.region + " " + element.venue.country);
                    console.log(moment(element.datetime).format("MM/DD/YYYY"), "\n");
                });
            } else {
                console.log("There are no upcoming concerts for " + band + ".");
            }
        })
        break;
    case "spotify-this-song":
        var song = process.argv.slice(3).join("+");
        if (song) {
            spotify.search({ type: 'track', query: song }, function (err, data) {
                if (!err) {
                    console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
                    console.log("Song: " + data.tracks.items[0].name);
                    console.log("Album: " + data.tracks.items[0].album.name);
                    console.log("Track preview: " + data.tracks.items[0].external_urls.spotify);

                } else if (err) {
                    return console.log('Error occurred: ' + err);
                }
            })
        } else {
            spotify.search({ type: 'track', query: 'the+sign' }, function (err, data) {
                console.log("You didn't enter a song title. Perhaps you would enjoy this:")
                console.log("Artist: " + data.tracks.items[5].album.artists[0].name);
                console.log("Song: " + data.tracks.items[5].name);
                console.log("Album: " + data.tracks.items[5].album.name);
                console.log("Track preview: " + data.tracks.items[5].external_urls.spotify);
            })
        }
        //   console.log(JSON.parse(JSON.stringify(data)));
        break;
    case "movie-this":
        var movie = process.argv.slice(3).join("+");
        if (movie) {
          movieRequest(movie);  
        } else {
            console.log("You did not input a movie title. Perhaps you would enjoy this movie:")
            movieRequest("Mr+Nobody");
        }
        break;
    case "do-what-it-says":
        
}

function movieRequest(movie) {
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // console.log(JSON.parse(body));
                body = JSON.parse(body);
                console.log(body.Title + " was released in " + body.Year +".");
                console.log("It received a rating of " + body.Ratings[0].Value + " from IMDB and a rating of " + body.Ratings[1].Value + " from Rotten Tomatoes.");
                console.log("It was made in " + body.Country + " in " + body.Language + ".");
                console.log("Plot: " + body.Plot);
                console.log("Cast: " + body.Actors);
            }
        });
}