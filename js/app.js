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
            var postVolumeScale = d3.scale.log()
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
                        fillOpacity: 1,
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

            L.mapbox.tileLayer('bmesh.gpmgindc').addTo(map);

            // Add NYC Neighborhood vector data to map
            geojson = L.geoJson(instasound.neighborhoodGeoJSON, {
                onEachFeature: onEachFeature
            }).addTo(map);

        }


        /**
         * Stop all previous audio from running.
         */
        function stopAudio() {

            instasound.clock.clearAll();

            if(instasound.synth) {
                instasound.synth.pause();
            }

            if(instasound.beatSynth) {
                instasound.beatSynth.pause();
            }

        }

        /**
         * For a given neighborhood's time-of-day instagram post histogram:
         * 1. Map values from the original scale to a human-audible frequency scale
         * 2. Schedule the notes to play over the course of PLAY_TIME_SECONDS
         * @param error d3.js error loading neighborhood histogram data
         * @param neighborhoodHistogram counts, density, and intervals of neighborhood instagram posts for each time-of-day
         */
        function playNeighborhoodHistogram(error, neighborhoodHistogram) {
            stopAudio();

            var neighborhoodCounts = neighborhoodHistogram.counts;

            var frequencyScale = d3.scale.linear()
                .domain([d3.min(neighborhoodCounts),d3.max(neighborhoodCounts)])
                .range([instasound.MIN_FREQUENCY, instasound.MAX_FREQUENCY]);

            var frequencies = neighborhoodCounts.map(frequencyScale);
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

            instasound.synth = flock.synth({
                nickName: "sin-synth",
                synthDef: {
                    id: "carrier",
                    ugen: "flock.ugen.sinOsc",
                    freq: {
                        ugen: "flock.ugen.sequence",
                        freq: 1 / noteTimeSeconds,
                        list: frequencies
                    },
                    mul: {
                        ugen: "flock.ugen.line",
                        start: 0.5,
                        end: 0.5,
                        duration: 0.0
                    }
                }
            });

            instasound.beatSynth = flock.synth({
                nickName: "beat-synth",
                synthDef: [{
                    id: "carrier-left",
                    ugen: "flock.ugen.sinOsc",
                    freq: {
                        ugen: "flock.ugen.sequence",
                        freq: 1 / noteTimeSeconds,
                        list: timeOfDayFrequencies
                    },
                    mul: {
                        ugen: "flock.ugen.line",
                        start: 0.5,
                        end: 0.5,
                        duration: 0.0
                    }
                }, {
                    id: "carrier-right",
                    ugen: "flock.ugen.sinOsc",
                    freq: {
                        ugen: "flock.ugen.sequence",
                        freq: 1 / noteTimeSeconds,
                        list: timeOfDayFrequencies.map(function (f) {
                            return f + 4;
                        })
                    },
                    mul: {
                        ugen: "flock.ugen.line",
                        start: 0.5,
                        end: 0.5,
                        duration: 0.0
                    }
                }]
            });

            function fadeOutAmp(synthName, atTime, startMul, endMul, duration, carriers) {
                var values = {};
                for (var i = 0; i < carriers.length; i++) {
                    values[carriers[i] + ".mul.start"] = startMul;
                    values[carriers[i] + ".mul.end"] = endMul;
                    values[carriers[i] + ".mul.duration"] = duration;
                }
                return {
                    interval: "once",
                    time: atTime,
                    change: {
                        synth: synthName,
                        values: values
                    }
                };
            }

            var fadeOutTime = instasound.PLAY_TIME_SECONDS;

            instasound.clock.schedule([
                fadeOutAmp("sin-synth", fadeOutTime, 0.5, 0.0, 0.5, ['carrier']),
                fadeOutAmp("beat-synth", fadeOutTime, 0.5, 0.0, 0.5, ['carrier-left', 'carrier-right'])
            ]);

            flock.enviro.shared.play();

        }


        d3.json('data/neighborhood_stats.json', function(error, neighborhoodStatsData) {

            d3.json('data/nycneighborhoods.json', function(error, neighborhoodGeoJSONData) {

                // Attach some variables to the main namespace for use in debugging.
                window.instasound = {
                    // Initialize Flocking.js clock and synth. We need these to be shared across plays so that we can
                    // start/stop the synth.
                    clock: flock.scheduler.async(),
                    synth: undefined,
                    beatSynth: undefined,
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

