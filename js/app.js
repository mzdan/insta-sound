(function(){


    /**
     * Main entry point to the insta-sound application.
     */
    function initializeInstaSound() {

        /**
         * Retrieves the neighborhood name from a layer.
         * @param layer
         */
        function neighborhoodFromLayer(layer) {
            return layer.feature.properties.NTAName;
        }

        /**
         * Retrieves the borough name from a layer.
         * @param layer
         */
        function boroughFromLayer(layer) {
            return layer.feature.properties.BoroName;
        }

        /**
         * @param layer
         * @return true if we have data for this neighborhood
         */
        function neighborhoodHasPosts(neighborhood) {
            return neighborhood in instasound.neighborhoodStats;
        }

        /**
         * Queues the neighborhood's instagram data for sonification.
         * @param e click event
         */
        function queueNeighborhoodAudio(e) {
            var layer = e.target;
            var neighborhood = neighborhoodFromLayer(layer);
            var borough = boroughFromLayer(layer);

            document.getElementById('neighborhood_tod').innerHTML =
                "<img class='hist_img' src='./images/neighborhoods/" + neighborhood + "/tod_polar.png' />";

            document.getElementById('borough').innerText = borough;
            document.getElementById('neighborhood').innerText = neighborhood;

            if(neighborhoodHasPosts(neighborhood)) {
                d3.json('data/neighborhood_histogram/neighborhood_histogram_' + neighborhood + '.json',
                    playNeighborhoodHistogram);
            }
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

            var postVolumes = d3.map(instasound.neighborhoodStats).values().map(function(d) {return d.posts});
            var postVolumeScale = d3.scale.linear()
                .domain([d3.min(postVolumes), d3.max(postVolumes)])
                .range(["black", "red"]);

            /**
             * Tell MapBox.js what functions to call when mousing over and out of a neighborhood and when
             * clicking on a neighborhood.
             */
            function onEachFeature(feature, layer) {
                var neighborhood = neighborhoodFromLayer(layer);
                if(neighborhoodHasPosts(neighborhood)) {
                    var color = postVolumeScale(instasound.neighborhoodStats[neighborhood].posts)
                    layer.setStyle({
                        weight: 1,
                        color: "black",
                        fillColor: postVolumeScale(instasound.neighborhoodStats[neighborhood].posts)
                    });

                    layer.on({
                        click: queueNeighborhoodAudio
                    });
                } else {
                    layer.setStyle({
                        weight: 0,
                        color: "white",
                        fillColor: "white"
                    });
                }
            }

            // Here is where the magic happens: Manipulate the z-index of tile layers,
            // this makes sure our vector data shows up above the background map and
            // under roads and labels.
            L.mapbox.tileLayer('bmesh.gpmgindc').addTo(map);

            // Add NYC Neighborhood vector data to map
            geojson = L.geoJson(instasound.neighborhoodGeoJSON, {
                onEachFeature: onEachFeature
            }).addTo(map);

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
                instasound.beatSynth.pause();
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
            instasound.beatSynth = flock.synth({
                nickName: "beat-synth",
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


            var frequencyScale = d3.scale.linear()
                .domain([d3.min(neighborhoodCounts),d3.max(neighborhoodCounts)])
                .range([instasound.MIN_FREQUENCY, instasound.MAX_FREQUENCY])

            var frequencies = neighborhoodCounts.map(frequencyScale)
            var timeOfDayFrequencies = frequencies.map(function(frequency, i) {
                                        switch(Math.floor(i/(frequencies.length/4)))
                                        {
                                            case 0:
                                                return 200;
                                            case 1:
                                                return 300;
                                            case 2:
                                                return 400;
                                            case 3:
                                                return 500;
                                        }
                                    });

            var noteTimeSeconds = instasound.PLAY_TIME_SECONDS/frequencies.length;
            console.log(noteTimeSeconds);

            function scheduleSynth(freq, name) {
                instasound.clock.schedule([
                    {
                        interval: "repeat",
                        time: noteTimeSeconds,
                        change: {
                            synth: name,
                            values: {
                                "carrier.freq": {
                                    synthDef: {
                                        ugen: "flock.ugen.sequence",
                                        list: freq
                                    }
                                }
                            }
                        }
                    },
                    {
                        interval: "once",
                        time: instasound.PLAY_TIME_SECONDS,
                        change: {
                            synth: name,
                            values: {
                                "carrier.mul.start": 0.25,
                                "carrier.mul.end": 0.0,
                                "carrier.mul.duration": instasound.PLAY_TIME_SECONDS
                            }
                        }
                    }
                ]);

            }

            instasound.clock.clearAll(); // Clears any previously scheduled audio.

            scheduleSynth(frequencies, 'sin-synth');
            scheduleSynth(timeOfDayFrequencies, 'beat-synth');

            instasound.synth.play();
            instasound.beatSynth.play();

        }


        d3.json('data/neighborhood_stats.json', function(error, neighborhoodStatsData) {

            d3.json('data/nycneighborhoods.json', function(error, neighborhoodGeoJSONData) {

                // Attach some variables to the main namespace for use in debugging.
                window.instasound = {
                    // Initialize Flocking.js clock and synth. We need these to be shared across plays so that we can
                    // start/stop the synth.
                    clock: flock.scheduler.async(),
                    synth: undefined,
                    neighborhoodStats: neighborhoodStatsData,
                    neighborhoodGeoJSON: neighborhoodGeoJSONData,
                    PLAY_TIME_SECONDS : 12,
                    MIN_FREQUENCY : 80,
                    MAX_FREQUENCY : 800
                };

                initializeMap();

            });

        });

    }

    window.onload = initializeInstaSound();

})();

