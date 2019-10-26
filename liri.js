require("dotenv").config(); // import and configure dotenv
const moment = require('moment') // import moment
const axios = require('axios'); // import axios
const Spotify = require('node-spotify-api') // import spotify api
const keys = require("./keys.js") // import spotify keys
const spotify = new Spotify(keys.spotify)
const fs = require('fs') // import filesystem
const inquirer = require('inquirer')// import inquirer

// assign progress.argv[2] to command
// assign progress.argv[3], progress.argv[4], progress.argv[etc] to searchParam
const [ , ,command , ...searchParam] = process.argv
const entry = searchParam.join('+') // combine the array of entries into a string with '+'

// boolean for repeating liri()
let repeat = true

// Function to log in a log file
const logCommand = (commandToLog) => {
    fs.readFile('log.txt', 'utf8', (e, data) => {
        if(e) {
            fs.writeFile('log.txt', `${moment().format('MM/DD/YY HH:MM:SSS')} Log start \n`, e =>  e ? e : true)
            fs.appendFile('log.txt', `${moment().format('MM/DD/YY HH:MM:SSS')} ${commandToLog} \n`, e =>  e ? e : true)
        } else {
            fs.appendFile('log.txt', `${moment().format('MM/DD/YY HH:MM:SSS')} ${commandToLog} \n`, e =>  e ? e : true)
        } // end else
    }) // end readFile
} // end logCommand

const concertThis = band => { // Get concert info of a band
    //Get the band information using axios
    axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`)
    .then( ({ data }) => {// the response is an object. The info we need is in "data" in the object
        console.log(`Concerts for ${band}`)
        if(data.length === 0){// if there is no info
            console.log("No concerts found")
            logCommand('results: No concerts found!\n')
        } else { // data has something
            let searchResults = []
            data.forEach( ({venue, datetime}) => {// loop through the array to using destructed variables
                // venue and datetime are inside an element in the data array
                console.log(`-----------------------------------`)
                console.log(`Venue: ${venue.name}, ${venue.city}, ${venue.region} ${venue.country}`)
                console.log(`Date: ${moment(datetime, 'YYYY-MM-DDTHH:mm').format("MM/DD/YYYY")}`)
                searchResults.push({
                    venue: `${venue.name}, ${venue.city}, ${venue.region} ${venue.country}`,
                    date: `${moment(datetime, 'YYYY-MM-DDTHH:mm').format("MM/DD/YYYY")}`
                })
            }) // end forEach
            logCommand(`Search results start:\n`)
            searchResults.forEach( result => {
                logCommand(`
                    Venue: ${result.venue}
                    Date: ${result.date}`) 
            })
            logCommand(`Search results end\n`)
        } //end else
    }) // end .then
} //end concertThis

const getArtists = (artists) => {
    let names = []
    artists.forEach( artist => {
        names.push(artist.name)
    })
    return names
} // end getArtists

const spotifyThis = song => { // get song info
    logCommand('Running spotify-this')
    spotify
        .search({ type: 'track', query: song }) //destructed api for spotify
        .then( ({tracks}) => {// the result comes back as an object. 
            //The info we need is in the "tracks" property of the object
            logCommand(`Song entry is ${song}`)
            if(tracks.total === 0){// tracks is an object. Inside of it is a property "total"
            // "total" shows the total number songs found
            // if "total" is 0, console log the song "The Sign" per the HW reqs
                spotify.request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE?si=wZi-U0FHQk6NrInTb_qgkw')
                    .then( data => {
                        //console.log(data)
                        logCommand('Song not found!')
                        console.log(`-----------------------------------`)
                        console.log(`Song name: ${data.name}`)
                        console.log(`From the album: ${data.album.name}`)
                        console.log(`Preview URL: ${data.preview_url}`)
                        console.log(`by: ${getArtists(data.artists)}`)
                        // end forEach
                        logCommand(`
                            Song name: ${data.name}
                            From the album: ${data.album.name}
                            Preview URL: ${data.preview_url}
                            by ${getArtists(data.artists)}`)
                    })//end .then
                    .catch( e => console.log(e))
            } else { //if tracks.total is more than 0
                // the search results from the spotify API is inside the "items" property of tracks.
                // the "items" property is an array
                logCommand(`Total entries found: ${tracks.total} only showing 20`)
                tracks.items.forEach( item => {
                    //artists is an array
                    console.log(`-----------------------------------`)
                    console.log(`Song name: ${item.name}`)
                    console.log(`From the album: ${item.album.name}`)
                    console.log(`Preview URL: ${item.preview_url}`)
                    console.log(`by: ${getArtists(item.artists)}`)
                    logCommand(`
                    Song name: ${item.name}
                    From the album: ${item.album.name}
                    Preview URL: ${item.preview_url}
                    by ${getArtists(item.artists)}`)
                }) // end forEach
                console.log(`Total entries found: ${tracks.total} only showing 20`)
            } // end else
        }) //end .then
        .catch( e => console.log(e))
} // end spotifyThis

const getTomatometer = ratings => {
    let tomatometer = ''
    ratings.forEach( rating => { //loop through the Ratings array for Rotten Tomatoes
        rating.Source === 'Rotten Tomatoes' ? tomatometer = rating.Value : null
    }) //end forEach

    return tomatometer
} // end getTomatometer

const movieThis = movie => { // get movie info
    // get movie info using axios
    logCommand(`Looking up movie ${movie}`)
    axios.get(`http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`)
    .then( ({data}) => { // The response we get is an object. The info we need is in the property data
        // using destructing method to get the data directly from the object
        //console.log(data)
        if(data.Response === 'False'){// If the property "Response" is false, it means that the movie doesn't exist
                                      // in the omdb database
            console.log(data.Error)
            logCommand('data.Error')
        } else { // If the movie exists
            console.log(`-----------------------------------`)
            console.log(`Title: ${data.Title}`)
            console.log(`Release Date: ${data.Year}`)
            console.log(`Rating: ${data.imdbRating}`)
            console.log(`Country: ${data.Country}`)
            console.log(`Languange: ${data.Language}`)
            console.log(`Plot: ${data.Plot}`)
            console.log(`Actors: ${data.Actors}`)
            console.log(`Tomatometer: ${getTomatometer(data.Ratings)}`)
            logCommand(`
            Title: ${data.Title}
            Release Date: ${data.Year}
            Rating: ${data.imdbRating}
            Country: ${data.Country}
            Languange: ${data.Language}
            Plot: ${data.Plot}
            Actors: ${data.Actors}
            Tomatometer: ${getTomatometer(data.Ratings)}
            `)
        } //end else
    }) // end .then
    .catch(e => console.log(e))
} // end movieThis

const translateCommand = (perform, value) => { // translate the commands in the HW to do something with a given value
    switch(perform){ // perform is the command in progress.argv[2]
        case 'concert-this':
            concertThis(value)// value is the value in progress.argv[3] + progress.argv[4] + progress.argv[etc]
            return true
        case 'spotify-this-song':
            spotifyThis(value)
            break
        case 'movie-this':
            movieThis(value)
            break
        case 'do-what-it-says':
            fs.readFile(value, 'utf8', (e, data) => {
                e ? console.log(e) : null
                const input = data.split(',')
                const command = input[0]
                const [, ...arg] = input
                console.log(`command is ${command} and argument is ${input}`)
                logCommand(`command is ${command} and argument is ${input}`)
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
} // end translateCommand

const repeater = () => {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'loopback',
                message: 'Would you like to run liri again? (just hit enter for YES)?',
                default: true
            }
        ])
        .then( answers => {
            if(answers.loopback){
                liri()
            } else {
                repeat = false
                console.log('Thank you for using this app')
            } 
        })
} // end repeater

const liri = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What do you want to do?",
                name: "command",
                choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says" ]
            },
            {
                type: 'input',
                name: 'entry',
                message: 'Enter a band or artist name to get concert dates: ',
                default: 'Celine Dion',
                when: answers => {
                return answers.command === 'concert-this'
                }
            },
            {
                type: 'input',
                name: 'entry',
                message: 'Enter a song title to look up: ',
                default: 'Circle of Life',
                when: answers => {
                return answers.command === 'spotify-this-song'
                }
            },
            {
                type: 'input',
                name: 'entry',
                message: 'Enter a movie name you want to look up: ',
                default: 'The Matrix',
                when: answers => {
                return answers.command === 'movie-this'
                }
            },
            {
                type: 'input',
                name: 'entry',
                message: 'Enter a file name you want to run: ',
                default: './random.txt',
                when: answers => {
                return answers.command === 'do-what-it-says'
                }
            }
        ])
        .then( answers => {
            //console.log(answers)
            translateCommand(answers.command, answers.entry)
            if(repeat){
                setTimeout(repeater, 2000)
            } else {
                console.log('Thank you for using this app')
            }
        })
} // end liri

logCommand('App Start')
if(command === '' || (entry === '' && command === '')){
    logCommand(`No arguments passed running inqirer`)
    liri()
} else {
    translateCommand(process.argv[2], entry)
    logCommand(`command is ${process.argv[2]} ${entry}`)
}

//logCommand('app run end')