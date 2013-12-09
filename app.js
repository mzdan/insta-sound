// interval in milliseconds
var PLAY_INTERVAL = 1500;

// Create a map, centered on Manhattan, to display instagram posts and neighborhoods.
var MAP_CENTER = [40.775,-73.98];
var MAP_ZOOM = 11;
var map = L.mapbox.map('map').setView(MAP_CENTER, MAP_ZOOM);

// Set base style of vector data
function style(feature) {
    return {
        weight: 0,
        fillOpacity: 0.5,
        fillColor: '#FFEDA0'
    };
}

function highlightFeature(layer) {
    layer.setStyle({
        weight: 10,
        opacity: 1,
        color: '#09F',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: '#FEB24C'
    });

    setTimeout(function() { resetHighlight(layer) }, PLAY_INTERVAL);
}

function resetHighlight(layer) {
    geojson.resetStyle(layer);
}

// Add neighborhood vector data to map
geojson = L.geoJson(neighborhoods, {
    style: style
}).addTo(map);

// TODO: Sort this out. We shouldn't really need all of this layer Z-indexing.
// Here is where the magic happens: Manipulate the z-index of tile layers,
// this makes sure our vector data shows up above the background map and
// under roads and labels.
var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
var topLayer = L.mapbox.tileLayer('bobbysud.map-3inxc2p4').addTo(map);
topPane.appendChild(topLayer.getContainer());
topLayer.setZIndex(7);

/**
 * Retrieve a layer for a given LatLng.
 * @param latLng an L.LatLng object
 * @returns layer the first layer in which the given point exists
 */
function layerFromLatLng(latLng) {
    return leafletPip.pointInLayer(latLng, geojson)[0];
}
var boroughFrequencies = {
    "Brooklyn" : 277.18,
    "Bronx" : 329.63,
    "Queens" : 349.23,
    "Staten Island" : 392.00,
    "Manhattan" : 440
};

/**
 * Given a borough name, plays a note for about one second.
 * @param borough
 */
function playBorough(borough) {

    // Create a synth with two different channels.
    // The left and the right channels are both sine waves,
    // but slightly apart in frequency.
    // This creates a stereo beating effect.
    var synth = flock.synth({
        synthDef: [
            {
                id: "leftSine",
                ugen: "flock.ugen.sinOsc",
                freq: boroughFrequencies[borough],
                mul: 0.25
            },
            {
                id: "rightSine",
                ugen: "flock.ugen.sinOsc",
                freq: boroughFrequencies[borough] + 4,
                mul: 0.25
            }
        ]
    });

    synth.play();
    setTimeout(function() { synth.pause() }, PLAY_INTERVAL);

}

/**
 * Draws a series of vertical lines corresponding to instagram posts.
 * @param data the instagram post data
 */
function drawLineBar(data) {

    // Line bar settings:
    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 400 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var firstPublishedDate = instagram_data[0].publishedDate;
    var lastPublishedDate = instagram_data[instagram_data.length - 1].publishedDate;

    var timeScale = d3.time.scale()
        .domain([firstPublishedDate, lastPublishedDate])
        .range([0, width]);

    var format = d3.time.format("%b %e %H:%M");

    var timeAxis = d3.svg.axis()
        .scale(timeScale)
        .ticks(3)
        .tickFormat(format);

    var svg = d3.select('#timeseries').append('svg')
        .attr('width', width + margin.left + margin.right + 'px')
        .attr('height', height + margin.top + margin.bottom + 'px');

    svg.selectAll('.vline')
        .data(data)
        .enter()
        .append('line')
        .attr("x1", function(d) {
            return margin.left + timeScale(d.publishedDate);
        })
        .attr("x2", function(d) {
            return margin.left + timeScale(d.publishedDate);
        })
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#000");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(timeAxis);

}

/**
 * Adds a marker to the map
 * @param post the post for which to add a marker
 */
function addMarker(post) {
    L.mapbox.markerLayer({
        // this feature is in the GeoJSON format: see geojson.org
        // for the full specification
        type: 'Feature',
        geometry: {
            type: 'Point',
            // coordinates here are in longitude, latitude order because
            // x, y is the standard for GeoJSON and many formats
            coordinates: [post.longitude, post.latitude]
        },
        properties: {
            'marker-size': 'small',
            'marker-color': '#00a'
        }
    }).addTo(map);
}

/**
 * Runs the whole show.
 *
 * Adds a marker, , highlighting the neighborhood, plays the borough note, and updates the image and text
 * for each instagram post.
 */
function play() {

    var i = 0;
    function playNextInstagramPost() {

        var post = instagram_data[i];
        addMarker(post);

        var ll = L.latLng(post.latitude, post.longitude);
        var layer = layerFromLatLng(ll);

        if(layer) {
            highlightFeature(layer);
            console.log(layer.feature.properties);

            var borough = layer.feature.properties.BoroName;
            playBorough(borough);
            document.getElementById("borough").innerText = borough;

            var neighborhood = layer.feature.properties.NTAName;
            document.getElementById("neighborhood").innerText = neighborhood;

            document.getElementById("image").innerHTML = "<img class='instagram_post' src='" + post.link_enclosure + "'>";
            console.log(post);
        }

        i++;
        if(i < instagram_data.length) {
            setTimeout(playNextInstagramPost, PLAY_INTERVAL);
        }
        else {
            setTimeout(function(){
                document.getElementById("image").innerHTML = "";
            }, PLAY_INTERVAL);
        }

    }

    playNextInstagramPost();

}

// Load Instagram data, draw the time plot, and start
// "playing" instagram posts.
d3.tsv('nyc_sample.tsv', function(error, data) {
    instagram_data = data;

    data.forEach(function(d){
        d.publishedDate = new Date(d.published);
        d.color = "#f00";
    });

    drawLineBar(data);
    play();

});

