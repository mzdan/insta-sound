(function(){
    /**
     * Main entry point to the insta-sound application.
     */
    function initializeInstaSound() {

        /**
         * Highlights the neighborhood and presents the instagram data for that neighborhood.
         * @param e layer hover event
         */
        function highlightNeighborhood(e) {
            var layer = e.target;
            var neighborhood = layer.feature.properties.NTAName;

            if(instasound.validNeighborhoods.indexOf(neighborhood) > -1) {

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

        /**
         * Queues the neighborhood's instagram data for sonification.
         * @param e click event
         */
        function queueNeighborhoodAudio(e) {
            var layer = e.target;
            var neighborhood = layer.feature.properties.NTAName;
            if(instasound.validNeighborhoods.indexOf(neighborhood) > -1) {
                d3.json('data/neighborhood_histogram/neighborhood_histogram_' + neighborhood + '.json',
                    playNeighborhoodHistogram);
            }
        }

        /**
         * Resets the colors when a neighborhood is not longer 'hovered'
         */
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
        }

        /**
         * Creates a new Mapbox map. Attaches NYC neighborhood highlighting on mouse hovers
         * and neighborhood instagram post sonification on click.
         */
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

            /**
             * Tell MapBox.js what functions to call when mousing over and out of a neighborhood and when
             * clicking on a neighborhood.
             */
            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightNeighborhood,
                    mouseout: resetHighlight,
                    click: queueNeighborhoodAudio
                });
            }

            // Add NYC Neighborhood vector data to map
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

        /**
         * For a given neighborhood's time-of-day instagram post histogram:
         * 1. Interpolate extra values to "fill" the histogram with more data points
         * 2. Map values from the original scale to a human-audible frequency scale
         * 3. Schedule the notes to play over the course of PLAY_TIME_SECONDS
         * @param error d3.js error loading neighborhood histogram data
         * @param neighborhoodHistogram counts, density, and intervals of neighborhood instagram posts for each time-of-day
         */
        function playNeighborhoodHistogram(error, neighborhoodHistogram) {

            // Stop all previous audio.
            if(instasound.synth) {
                instasound.synth.pause();
            }

            instasound.synth = flock.synth({
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

            /**
             * Create the illusion of continuous change by using linear interpolation of values.
             * @param values raw values
             * @returns {Array} interpolated values
             */
            function interpolateValues(values) {
                var result = [];
                for(var i = 0; i < values.length - 1; i++) {
                    result.push(values[i]);
                    var interpolatedValues = d3.range(0.1, 0.9, 0.1).map(d3.interpolate(values[i], values[i + 1]));
                    result = result.concat(interpolatedValues);
                }
                result.push(values[values.length - 1]);
                return result;
            }

            var interpolatedCounts = interpolateValues(neighborhoodCounts);


            var frequencyScale = d3.scale.linear()
                .domain([d3.min(interpolatedCounts),d3.max(interpolatedCounts)])
                .range([instasound.MIN_FREQUENCY, instasound.MAX_FREQUENCY])

            var frequencies = interpolatedCounts.map(frequencyScale)
            var noteTimeSeconds = instasound.PLAY_TIME_SECONDS/frequencies.length;

            instasound.clock.clearAll(); // Clears any previously scheduled audio.
            instasound.clock.schedule([
                {
                    interval: "repeat",
                    time: noteTimeSeconds,
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
                    time: instasound.PLAY_TIME_SECONDS,
                    change: {
                        synth: "sin-synth",
                        values: {
                            "carrier.mul.start": 0.25,
                            "carrier.mul.end": 0.0,
                            "carrier.mul.duration": noteTimeSeconds
                        }
                    }
                }
            ]);

            instasound.synth.play();

        }

        // Load instagram neighborhoods in order to constrain the app's operation only to those neighborhoods
        // for which we have data.
        d3.json('data/valid_neighborhoods.json', function(error, data) {

            initializeMap();

            // Attach some variables to the main namespace for use in debugging.
            window.instasound = {
                // Initialize Flocking.js clock and synth. We need these to be shared across plays so that we can start/stop
                // the synth.
                clock: flock.scheduler.async(),
                synth: undefined,
                validNeighborhoods: data,
                PLAY_TIME_SECONDS : 6,
                MIN_FREQUENCY : 80,
                MAX_FREQUENCY : 800
            };

        });

    }

    window.onload = initializeInstaSound();

})();

