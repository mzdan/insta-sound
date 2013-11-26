var geodata = [
	["chelsea", "2013-10-21 12:34:22"],
	["midtown", "2013-10-21 12:35:22"],
	["chinatown", "2013-10-21 12:36:22"],
	["midtown", "2013-10-21 12:37:22"],
	["east village", "2013-10-21 12:38:22"]
];


var neighborhoodNotes = {
	"chelsea" : "A3", 
	"midtown" : "D3", 
	"east village" : "E3", 
	"chinatown" : "F3", 
	};


function preparePost (post){
	var neighborhood = post[0];
	return [neighborhood, new Date(post[1]), neighborhoodNotes[neighborhood]];
}

var posts = geodata.map (preparePost);

