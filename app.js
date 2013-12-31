// Create a map, centered on Manhattan, to display instagram posts and neighborhoods.
var MAP_CENTER = [40.775,-73.98];
var MAP_ZOOM = 11;
var map = L.mapbox.map('nyc_map').setView(MAP_CENTER, MAP_ZOOM);

// Set base style of vector data
function style(feature) {
    return {
        weight: 0,
        fillOpacity: 0.5,
        fillColor: '#FFEDA0'
    };
}

// Set hover colors
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 10,
        opacity: 1,
        color: '#09F',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: '#FEB24C'
    });
}

// A function to reset the colors when a neighborhood is not longer 'hovered'
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

// Tell MapBox.js what functions to call when mousing over and out of a neighborhood
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

// Add vector data to map
geojson = L.geoJson(neighborhoods, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

// Here is where the magic happens: Manipulate the z-index of tile layers,
// this makes sure our vector data shows up above the background map and
// under roads and labels.
var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
var topLayer = L.mapbox.tileLayer('bobbysud.map-3inxc2p4').addTo(map);
topPane.appendChild(topLayer.getContainer());
topLayer.setZIndex(7);


