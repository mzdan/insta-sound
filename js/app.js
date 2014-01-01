/**
 * Main entry point to the instasound application.
 */
function initializeInstaSound() {

    function initializeMap() {
        // Create a map, centered on Manhattan, to display instagram posts and neighborhoods.
        var MAP_CENTER = [40.755,-73.92];
        var MAP_ZOOM = 11;
        var map = L.mapbox.map('nyc_map').setView(MAP_CENTER, MAP_ZOOM);

        // Set base style of vector data
        function style(feature) {
            return {
                weight: 0,
                fillOpacity: 0.4,
                fillColor: '#FFEEA0'
            };
        }

        // Set hover colors
        function highlightFeature(e) {
            var layer = e.target;
            var neighborhood = layer.feature.properties.NTAName;
            if(validNeighborhoods.indexOf(neighborhood) > -1) {
                document.getElementById('neighborhood_tod').innerHTML = "<img class='hist_img' src='./images/tod_polar_" +
                    neighborhood + ".png' />";
                layer.setStyle({
                    weight: 10,
                    opacity: 1,
                    color: '#03F',
                    dashArray: '2',
                    fillOpacity: 0.7,
                    fillColor: '#05F'
                });
            }
        }

        function queueNeighborhoodAudio(e) {
            var layer = e.target;
            var neighborhood = layer.feature.properties.NTAName;
            if(validNeighborhoods.indexOf(neighborhood) > -1) {
                d3.json('data/neighborhood_histogram/neighborhood_histogram_' + neighborhood + '.json',
                    playNeighborhoodHistogram);
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
                mouseout: resetHighlight,
                click: queueNeighborhoodAudio
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
        window.validNeighborhoods = validNeighborhoods;
        initializeMap();
    });

    function playNeighborhoodHistogram(error, neighborhoodHistogram) {

        // Frequency Stair Stepping Demo
        var clock = flock.scheduler.async();
        var synth = flock.synth({
            nickName: "sin-synth",
            synthDef: {
                id: "carrier",
                ugen: "flock.ugen.sinOsc",
                mul: {
                    ugen: "flock.ugen.line",
                    start: 0.5,
                    end: 0.5,
                    duration: 1.0
                }
            }
        });

        var neighborhoodCounts = neighborhoodHistogram.counts;
        var interpolatedCounts = interpolateValues(neighborhoodCounts);

        var PLAY_TIME = 6;
        var MIN_FREQUENCY = 80;
        var MAX_FREQUENCY = 800;

        var frequencyScale = d3.scale.linear()
            .domain([d3.min(interpolatedCounts),d3.max(interpolatedCounts)])
            .range([MIN_FREQUENCY, MAX_FREQUENCY])

        var frequencies = interpolatedCounts.map(frequencyScale)
        var note_time = PLAY_TIME/frequencies.length;

        clock.schedule([
            {
                interval: "repeat",
                time: note_time,
                change: {
                    synth: "sin-synth",
                    values: {
                        "carrier.freq": {
                            synthDef: {
                                ugen: "flock.ugen.sequence",
                                loop: 1.0,
                                list: frequencies
                            }
                        }
                    }
                }
            },
            {
                interval: "once",
                time: PLAY_TIME,
                change: {
                    synth: "sin-synth",
                    values: {
                        "carrier.mul.start": 0.25,
                        "carrier.mul.end": 0.0,
                        "carrier.mul.duration": note_time
                    }
                }
            }
        ]);

        synth.play();
    }


}

/**
 * Create the feeling of continuous change by using linear interpolation of values.
 * @param values
 * @returns {Array}
 */
function interpolateValues(values) {
    console.log(values);
    var result = [];
    for(var i = 0; i < values.length - 1; i++) {
        result.push(values[i]);
        var interpolatedValues = d3.range(0.1, 0.9, 0.1).map(d3.interpolate(values[i], values[i + 1]));
        result = result.concat(interpolatedValues);
    }
    result.push(values[values.length - 1]);
    return result;
}

window.onload = function() {
    initializeInstaSound();
}
