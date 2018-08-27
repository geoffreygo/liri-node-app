require("dotenv").config();

var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var spotify = new spotify(keys.spotify);
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var whatDo = process.argv.slice(2);

function lookup(whatDo) {
    switch (whatDo[0]) {
        case "concert-this":
            var band = whatDo.slice(1).join(" ");
            console.log(band);
            if (band == "") {
                console.log("You did not enter a band.");
            } else {
                request("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp", function (err, response, body) {
                    if (!err && response.statusCode === 200) {
                        var concert = JSON.parse(body);
                        if (concert.length == 0) {
                            console.log("There are no upcoming shows for " + band + ".");
                        } else if (err) {
                            console.log("There was an error: " + err + ".");
                        } else {
                            concert.forEach(element => {
                                console.log(element.venue.name);
                                console.log(element.venue.city + " " + element.venue.region + " " + element.venue.country);
                                console.log(moment(element.datetime).format("MM/DD/YYYY"), "\n");
                            });
                        }
                    }
                })
            }
            break;
        case "spotify-this-song":
            var song = whatDo.slice(1).join("+");
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
            var movie = whatDo.slice(1).join("+");
            if (movie) {
            movieRequest(movie);  
            } else {
                console.log("You did not input a movie title. Perhaps you would enjoy this movie:")
                movieRequest("Mr+Nobody");
            }
            break;
        default:
            console.log("Something's gone wrong.");
    }
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

if (process.argv[2] == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
        return console.log(error);
        }
        // console.log(data);
        var dataArr = data.trim().replace(/"/g, "").split(",");
        // console.log(dataArr);
        for (var i = 0; i < dataArr.length; i += 2) {
            var singleItem = dataArr.slice(i, i+2);
            console.log(singleItem);
            lookup(singleItem);
        }
    });
} else {
    lookup(whatDo);
}