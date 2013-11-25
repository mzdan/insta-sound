var geodata = [
	["chelsea", "2013-10-21 12:34:22"],
	["midtown", "2013-10-21 12:35:22"],
	["chinatown", "2013-10-21 12:36:22"],
	["midtown", "2013-10-21 12:37:22"],
	["east village", "2013-10-21 12:38:22"]
];
function preparePost (post){
	return [post[0], new Date(post[1])];
}
var posts = geodata.map (preparePost);
