/**
 * Main entry point to the instasound application.
 */
function initializeInstaSound() {

    function initializeMap() {
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
            var neighborhood = layer.feature.properties.NTAName;
            if(validNeighborhoods.indexOf(neighborhood) > -1) {
                d3.json('data/neighborhood_histogram/neighborhood_histogram_' + neighborhood + '.json',
                    playNeighborhoodHistogram);
                document.getElementById('neighborhood_tod').innerHTML = "<img src='./images/tod_polar_" +
                    neighborhood + ".png' />";
                layer.setStyle({
                    weight: 10,
                    opacity: 1,
                    color: '#09F',
                    dashArray: '3',
                    fillOpacity: 0.7,
                    fillColor: '#FEB24C'
                });
            }
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

    }

    d3.json('data/valid_neighborhoods.json', function(error, validNeighborhoods) {
        console.log("Valid neighborhoods: ", validNeighborhoods);
        window.validNeighborhoods = validNeighborhoods;
        initializeMap();
    });

    function playNeighborhoodHistogram(error, neighborhoodHistogram) {
        nhist = neighborhoodHistogram;

        // Frequency Stair Stepping Demo
        var clock = flock.scheduler.async();
        var synth = flock.synth({
            nickName: "sin-synth",
            synthDef: {
                id: "carrier",
                ugen: "flock.ugen.sinOsc",
                freq: 220,
                mul: {
                    ugen: "flock.ugen.line",
                    start: 0,
                    end: 0.25,
                    duration: 1.0
                }
            }
        });

        var counts = neighborhoodHistogram.counts;
        var frequencyScale = d3.scale.linear()
            .domain([d3.min(counts),d3.max(counts)])
            .range([40, 600])

        var frequencies = counts.map(frequencyScale)

        clock.schedule([
            {
                interval: "repeat",
                time: 0.1,
                change: {
                    synth: "sin-synth",
                    values: {
                        "carrier.freq": {
                            synthDef: {
                                ugen: "flock.ugen.sequence",
                                list: frequencies
                            }
                        }
                    }
                }
            },
            {
                interval: "once",
                time: 8,
                change: {
                    synth: "sin-synth",
                    values: {
                        "carrier.mul.start": 0.25,
                        "carrier.mul.end": 0.0,
                        "carrier.mul.duration": 0.1
                    }
                }
            }
        ]);

        synth.play();
    }


}


window.onload = function() {
    initializeInstaSound();
}
