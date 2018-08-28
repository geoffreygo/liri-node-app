# liri-node-app

Liri is a node command line application with 4 options:
- concert-this: add a band name to the command line and liri will tell you all the upcoming shows for the band
- spotify-this-song: supply a song name and liri will get a few pieces of info about it for you
- movie-this: supply a movie name and liri will retrieve a bunch of info about it for you
- do-what-it-says: will read commands from the 'random.txt' file and run them for you

Behind the scenes, liri uses bandsintown for concert information, spotify for the song info, and omdb for the movie info. This is achieved with the help of a few npm packages:
- node-spotify-api: to get info from the spotify api
- dotenv: allows us to set environment variables, specifically the spotify api keys, keeping them from being broadcast
- request: allows api requests over https to bandsintown and omdb
- moment: allows formatting of dates and times
- winston: used to allow all console output to go to a file as well (basically allows a single output to go to multiple places)
