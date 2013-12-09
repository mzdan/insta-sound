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
}

function resetHighlight(layer) {
    geojson.resetStyle(layer);
}

// Set hover colors
function highlightFeatureHandler(e) {
    highlightFeature(e.target);
}

// A function to reset the colors when a neighborhood is not longer 'hovered'
function resetHighlightHandler(e) {
    resetHighlight(e.target);
}

// Tell MapBox.js what functions to call when mousing over and out of a neighborhood
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeatureHandler,
        mouseout: resetHighlightHandler
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


function layerFromLatLng(latLng) {
    return leafletPip.pointInLayer(latLng, geojson)[0];
}

function neighborhoodFromPoint(point) {
    return layerFromLatLng(L.latLng(point)).feature.properties.NTAName;
}

var ll = L.latLng(40.744034,-73.99624);

L.mapbox.markerLayer({
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        coordinates: [-73.99624,40.744034]
    },
    properties: {
        'marker-size': 'small',
        'marker-color': '#00a'
    }
}).addTo(map);

highlightFeature(layerFromLatLng(L.latLng(40.744034, -73.99634)));