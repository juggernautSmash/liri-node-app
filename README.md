# H1 liri-node-app
In this assignment, you will make LIRI. LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation and Recognition Interface, LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives you back data. This app supports four commands at the moment:
	1. concert-this <band/artist name>
		example if no concerts found:
			```
			$ node liri.js concert-this queen                                                                                       
			this is loaded
			Concerts for queen
			No concerts found
			```

		example if results found:
			```
			$ node liri.js concert-this jonas brothers                                                                              this is loaded
			Concerts for jonas+brothers
			-----------------------------------
			Venue: Auditorio Citibanamex, Monterrey,  Mexico
			Date: 10/27/2019
			-----------------------------------
			Venue: Auditorio Citibanamex, Monterrey,  Mexico
			Date: 10/28/2019
			...
			```

	2. spotify-this-song <name of song>
		example if no results found, it will pring out info for the song The Sign:
			```
			$ node liri.js spotify-this-song 23r2ef                                                                                 this is loaded
			-----------------------------------
			Song name: The Sign
			From the album: The Sign (US Album) [Remastered]
			Preview URL: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=d4831269678f41c6861370eb1e28595c
			by: Ace of Base
			```

		example if results found:
			```
			$ node liri.js spotify-this-song thunderstruck
			this is loaded
			-----------------------------------
			Song name: Thunderstruck
			From the album: The Razors Edge
			Preview URL: https://p.scdn.co/mp3-preview/3885f542871846183fefbd009577c95f5f46b0af?cid=d4831269678f41c6861370eb1e28595c
			by: AC/DC
			-----------------------------------
			Song name: Thunderstruck
			From the album: Iron Man 2
			Preview URL: https://p.scdn.co/mp3-preview/2d9544a444030dbf6f506c4c9bd5ae5708bc59f8?cid=d4831269678f41c6861370eb1e28595c
			by: AC/DC
			...
			```

	3. movie-this <movie name>
		example if no results found:
			```
			$ node liri.js movie-this this is a movie
			this is loaded
			Movie not found!
			```
		example if result found:
			```
			$ node liri.js movie-this Lion King
			this is loaded
			-----------------------------------
			Title: The Lion King
			Release Date: 1994
			Rating: 8.5
			Country: USA
			Languange: English, Swahili, Xhosa, Zulu
			Plot: A Lion cub crown prince is tricked by a treacherous uncle into thinking he caused his father's death and flees into exile in despair, only to learn in adulthood his identity and his responsibilities.
			Actors: Rowan Atkinson, Matthew Broderick, Niketa Calame-Harris, Jim Cummings
			Tomatometer: 93%
			```

	4. do-what-it-says <filename.txt>
		example with the txt file provided from the homework:
			```
			$ node liri.js do-what-it-says random.txt
			this is loaded
			command not found
			command is spotify-this-song and argument is spotify-this-song,"I Want it That Way"
			-----------------------------------
			Song name: I Want It That Way
			From the album: The Hits--Chapter One
			Preview URL: https://p.scdn.co/mp3-preview/e72a05dc3f69c891e3390c3ceaa77fad02f6b5f6?cid=d4831269678f41c6861370eb1e28595c
			by: Backstreet Boys
			-----------------------------------
			Song name: I Want It That Way
			From the album: Millennium
			Preview URL: https://p.scdn.co/mp3-preview/b8c2410a5acb68b462be6ac85f1312430e2b149c?cid=d4831269678f41c6861370eb1e28595c
			by: Backstreet Boys
			-----------------------------------
			```

If there is no argument passed, you will be prompted to select a command and will be guided to which command to use using the inquirer npm. 


