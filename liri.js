// using dotenv to store spotify keys
require("dotenv").config();
// requires for the npm packages in use
var keys = require("./keys.js");
var spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var fs = require("fs");
var winston = require("winston");
// creating spotify instance from constructor
var spotify = new spotify(keys.spotify);
// setting up winston npm package to write to console and file simultaneously
const { createLogger, format, transports } = require('winston');
const {printf} = format;
const myFormat = printf(info => {
    return `${info.message}`;
  });

const logger = createLogger({
    format: myFormat,
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'log.txt' })
    ]
});
// variable to store command line arguments (beginning at position 2 to leave out node and liri)
var whatDo = process.argv.slice(2);
fs.appendFile("log.txt", whatDo + "\n", function(err) {
    if (err) {
        console.log(err);
      }
})

// switch case wrapped in a function to allow it to be called with command line or by reading from file
function lookup(whatDo) {
    switch (whatDo[0]) {
        case "concert-this":
            // set band equal to rest of whatDo array, leaving out the command (concert-this) and converting to string
            var band = whatDo.slice(1).join(" ");
            // If a band was not entered, inform the user. Otherwise query bandsintown for the band's upcoming shows
            if (band == "") {
                logger.info("You did not enter a band.");
            } else {
                request("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp", function (err, response, body) {
                    if (!err && response.statusCode === 200) {
                        var concert = JSON.parse(body);
                        // if an empty array is returned, the band has no upcoming shows
                        if (concert.length == 0) {
                            logger.info("There are no upcoming shows for " + band + ".");
                        } else if (err) {
                            logger.info("There was an error: " + err + ".");
                        // once we know we have a valid response, print out the venue, location, and day for each upcoming show
                        } else {
                            concert.forEach(element => {
                                logger.info(element.venue.name);
                                logger.info(element.venue.city + " " + element.venue.region + " " + element.venue.country);
                                logger.info(moment(element.datetime).format("MM/DD/YYYY"), "\n");
                            });
                        }
                    }
                })
            }
            break;
        case "spotify-this-song":
            // set song equal to rest of whatDo array, leaving out command (spotify=this=song) and converting to string
            var song = whatDo.slice(1).join("+");
            // if user entered a song, query spotify for it and if there's no error, print out the artist, song title, album, and song preview url
            if (song) {
                spotify.search({ type: 'track', query: song }, function (err, data) {
                    if (!err) {
                        logger.info("Artist: " + data.tracks.items[0].album.artists[0].name);
                        logger.info("Song: " + data.tracks.items[0].name);
                        logger.info("Album: " + data.tracks.items[0].album.name);
                        logger.info("Track preview: " + data.tracks.items[0].external_urls.spotify);

                    } else if (err) {
                        return logger.info('Error occurred: ' + err);
                    }
                })
            // else no song was entered, default to 'The Sign' by Ace of Base
            } else {
                spotify.search({ type: 'track', query: 'the+sign' }, function (err, data) {
                    logger.info("You didn't enter a song title. Perhaps you would enjoy this:")
                    logger.info("Artist: " + data.tracks.items[5].album.artists[0].name);
                    logger.info("Song: " + data.tracks.items[5].name);
                    logger.info("Album: " + data.tracks.items[5].album.name);
                    logger.info("Track preview: " + data.tracks.items[5].external_urls.spotify);
                })
            }
            break;
        case "movie-this":
            // set movie equal to rest of whatDo array, leaving out command (movie-this)
            var movie = whatDo.slice(1).join("+");
            // if the user entered a movie, pass it to the movieRequest function
            if (movie) {
            movieRequest(movie);
            // if the user did not enter a movie, pass Mr Nobody to movieRequest
            } else {
                logger.info("You did not input a movie title. Perhaps you would enjoy this movie:")
                movieRequest("Mr+Nobody");
            }
            break;
        // ptint out that something has gone wrong if a proper command was not entered
        default:
            logger.info("Something's gone wrong. Please check your command.");
    }
}
// movieRequest function retrieves info for selected movie from OMDB and prints out title, year, ratings from IMDB and Rotten Tomatoes, country, language, plot, and actors
function movieRequest(movie) {
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // console.log(JSON.parse(body));
                body = JSON.parse(body);
                logger.info(body.Title + " was released in " + body.Year +".");
                logger.info("It received a rating of " + body.Ratings[0].Value + " from IMDB and a rating of " + body.Ratings[1].Value + " from Rotten Tomatoes.");
                logger.info("It was made in " + body.Country + " in " + body.Language + ".");
                logger.info("Plot: " + body.Plot);
                logger.info("Cast: " + body.Actors);
            }
        });
}
//if command is do-what-it-says
if (process.argv[2] == "do-what-it-says") {
    // get contents of random.txt
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
        return logger.info(error);
        }
        // put contents of file into an array
        var dataArr = data.trim().replace(/"/g, "").split(",");
        // loop through array 2 items at a time; first item will be command, second will be name to query, and send to lookup function
        for (var i = 0; i < dataArr.length; i += 2) {
            var singleItem = dataArr.slice(i, i+2);
            logger.info(singleItem);
            lookup(singleItem);
        }
    });
// if command is not do-what-it-says, run lookup on command line arguments
} else {
    lookup(whatDo);
}