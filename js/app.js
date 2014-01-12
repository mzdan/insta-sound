(function(){
    if(!window.instasound) {
        window.instasound = {};
    }

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
                    instasound.audio.playNeighborhoodHistogram);
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

        d3.json('data/neighborhood_stats.json', function(error, neighborhoodStatsData) {

            d3.json('data/nycneighborhoods.json', function(error, neighborhoodGeoJSONData) {

                // Attach some variables to the main namespace for use in debugging.
                window.instasound.neighborhoodStats = neighborhoodStatsData;
                window.instasound.neighborhoodGeoJSON = neighborhoodGeoJSONData;

                initializeMap();

            });

        });

    }

    window.onload = initializeInstaSound();

})();

