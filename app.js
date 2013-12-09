// Create a map, centered on Manhattan, to display instagram posts and neighborhoods.
var map = L.mapbox.map('map').setView([40.775,-73.98], 12);

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

    setTimeout(function() { resetHighlight(layer) }, 1000);
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

// Load Instagram data, draw the time plot, and start
// "playing" instagram posts, highlighting the neighborhood of each post on the map.

// interval in milliseconds
var PLAY_INTERVAL = 1000;

d3.tsv('nyc_sample.tsv', function(error, data) {
    instagram_data = data;

    var margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 500 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    data.forEach(function(d){
        d.publishedDate = new Date(d.published);
        d.color = "#f00";
    });

    var firstPublishedDate = instagram_data[0].publishedDate;
    var lastPublishedDate = instagram_data[instagram_data.length - 1].publishedDate;

    var timeScale = d3.time.scale()
        .domain([firstPublishedDate, lastPublishedDate])
        .range([0, width]);

    var format = d3.time.format("%Y-%m-%d %H:%M");

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
        .style("stroke", function(d) {
            return d.color;
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(timeAxis);


    var i = 0;
    function playNextInstagramPost() {

        var post = instagram_data[i];
        post.color = "#000";
        setTimeout(function(){post.color = "#000";}, PLAY_INTERVAL);

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

        var ll = L.latLng(post.latitude, post.longitude);
        var layer = layerFromLatLng(ll);

        if(layer) {
            highlightFeature(layer);
            var neighborhood = layer.feature.properties.NTAName;
            document.getElementById("neighborhood").innerText = neighborhood;
            document.getElementById("image").innerHTML = "<img src='" + post.link_preview + "'>";
            console.log(post.link_preview);
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

});
