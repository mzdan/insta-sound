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

// Add vector data to map
geojson = L.geoJson(neighborhoods, {
    style: style
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

