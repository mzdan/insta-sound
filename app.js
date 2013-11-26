console.log(posts);


var channel_max = 10;										
// number of channels
var audiochannels = new Array();
for (a=0;a<channel_max;a++) {									
	// prepare the channels
	audiochannels[a] = new Array();
	audiochannels[a]['channel'] = new Audio();						
	// create a new audio object
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
  if ((new Date().getTime() - start) > milliseconds){
  break;
  }
  }
}

function play_multi_sound(s) {
	audiochannels[0]['channel'].src = document.getElementById(s).src;
	audiochannels[0]['channel'].load();
	audiochannels[0]['channel'].play();
}

for (p=0;p<posts.length;p++) {
	var note = posts[p][2];
	console.log("Setting time for " + note);
	play_multi_sound(note);
	console.log(note);
	setTimeout(function(){
		play_multi_sound(note);
		},2000);
}

