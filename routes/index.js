var request = require('request');
var calculated = [];
module.exports = function(app) {
	app.get('/', index);
};

var index = function(req, res) {
	request.get("http://www.radiorock.fi/api/programdata/getlatest?", function(err, response, body) {
		var json = JSON.parse(body);
		parseArtists(json.result, function() {
			res.send(calculated);
		});


	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};

var findArtist = function(arr, name) {
	for(var i = 0 ; i < arr.length ; ++i) {
		if(arr[i].artist === name) {
			return i;
		}
	}
	return -1;
}

var parseArtists = function(json, cb) {
	json.forEach(function(data) {
		var artistIndex = findArtist(calculated, data.artist);
		if (artistIndex < 0) {
			calculated.push({
				artist: data.artist,
				count: 1,
				songs:
				[
					{
						song: data.song,
						count: 1,
						timestamp: data.timestamp
					}
				]
			});
		} else {
			var foundArtist = calculated[artistIndex]; 
			foundArtist.count++;
			var found = false;
			for(var i = 0 ; i < foundArtist.songs.length ; ++i) {
				if(foundArtist.songs[i].song == data.song) {
					foundArtist.songs[i].count++;
					found = true;
				}
			}

			if(!found) {
				foundArtist.songs.push({
					song: data.song,
					count: 1,
					timestamp: data.timestamp
				});
			}

		}

	});
	cb();
};
