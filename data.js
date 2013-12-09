d3.tsv('nyc_sample.tsv', function(error, data) {
    instagram_data = data;

    var margin = {top: 30, right: 30, bottom: 30, left: 60},
        width = 500 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    data.forEach(function(d){
        d.publishedDate = new Date(d.published);
    });


    firstPublishedDate = instagram_data[0].publishedDate;
    lastPublishedDate = instagram_data[instagram_data.length - 1].publishedDate;

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
        .style("stroke", "#000");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
        .call(timeAxis);


    var i = 0;
    function playInstagramPost() {
        var post = instagram_data[i];
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
        highlightFeature(layer);
        console.log(layer.feature.properties.NTAName)
        i++;
        if(i < instagram_data.length) {
            setTimeout(playInstagramPost, 1000);
        }
    }

    playInstagramPost();

});