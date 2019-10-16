const moment = require('moment')
const axios = require('axios');
const Spotify = require('node-spotify-api')
require("dotenv").config();
const keys = require("./keys.js")
const spotify = new Spotify(keys.spotify)
const fs = require('fs')

const [ , , , ...searchParam] = process.argv
const entry = searchParam.join('+')

const concertThis = band => {
    axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`)
    .then( ({ data }) => {
        //console.log(data)
        console.log(`Concerts for ${band}`)
        //console.log(data)
        if(data.length === 0){
            console.log("No concerts found")
        } else {
            console.log(`Concerts for ${band}`)
            data.forEach( ({venue, datetime}) => {
                console.log(`-----------------------------------`)
                console.log(`Venue: ${venue.name}, ${venue.city}, ${venue.region} ${venue.country}`)
                console.log(`Date: ${moment(datetime, 'YYYY-MM-DDTHH:mm').format("MM/DD/YYYY")}`)
            }) // end forEach
        } //end else
    }) // end .then
} //end concertThis

const spotifyThis = song => {
    const spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    })
    spotify
        .search({ type: 'track', query: song })
        .then( ({tracks}) => {
            if(tracks.total === 0){
                spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE?si=wZi-U0FHQk6NrInTb_qgkw')
                    .then( data => {
                        //console.log(data)
                        const artists = data.artists
                        console.log(`-----------------------------------`)
                        console.log(`Song name: ${data.name}`)
                        console.log(`From the album: ${data.album.name}`)
                        console.log(`Preview URL: ${data.preview_url}`)
                        console.log(`by:`)
                        artists.forEach( artist => {
                            console.log(artist.name)
                        }) // end forEach
                    })//end .then
                    .catch( e => console.log(e))
            } else {
                tracks.items.forEach( item => {
                    //console.log(item)
                    const artists = item.artists
                    console.log(`-----------------------------------`)
                    console.log(`Song name: ${item.name}`)
                    console.log(`From the album: ${item.album.name}`)
                    console.log(`Preview URL: ${item.preview_url}`)
                    console.log(`by:`)
                    artists.forEach( artist => {
                        console.log(artist.name)
                    }) // end forEach
                }) // end forEach
                console.log(`Total entries found: ${tracks.total} only showing 20`)
            } // end else
        }) //end .then
        .catch( e => console.log(e))
} // end spotifyThis

const movieThis = movie => {
    axios.get(`http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`)
    .then( ({data}) => {
        //console.log(data)
        if(data.Response === 'False'){
            console.log(data.Error)
        } else {
            console.log(`-----------------------------------`)
            console.log(`Title: ${data.Title}`)
            console.log(`Release Date: ${data.Year}`)
            console.log(`Rating: ${data.imdbRating}`)
            console.log(`Country: ${data.Country}`)
            console.log(`Languange: ${data.Language}`)
            console.log(`Plot: ${data.Plot}`)
            console.log(`Actors: ${data.Actors}`)
            //Get Rotten Tomatoes Ratings
            data.Ratings.forEach( rating => {
                rating.Source === 'Rotten Tomatoes' ? console.log(`Tomatometer: ${rating.Value}`) : null
            }) //end forEach
        } //end else
    }) // end .then
    .catch(e => console.log(e))
} // end movieThis
        

switch(process.argv[2]){
    case 'concert-this':
        concertThis(entry)
        break
    case 'spotify-this-song':
        spotifyThis(entry)
        break
    case 'movie-this':
        movieThis(entry)
        break
    case 'do-what-it-says':
        fs.readFile('./random.txt', 'utf8', (e, data) => {
            e ? console.log(e) : null
            
            const input = data.split(',')
            const command = input[0]
            const [, ...arg] = input
            // console.log(command)
            // console.log(arg.toString())
            switch(command){
                case 'concert-this':
                    concertThis(arg.toString())
                    break
                case 'spotify-this-song':
                    spotifyThis(arg.toString())
                    break
                case 'movie-this':
                    movieThis(arg.toString())
                    break
                default:
                    console.log('command not found')
            } // end switch
        }) // end fs.readFile``
        default:
            console.log(`command not found`)
} // end switch

