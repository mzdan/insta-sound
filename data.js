d3.tsv('nyc_sample.tsv', function(error, data) {
    instagram_data = data;

    var width = 500;
    var height = 40;

    data.forEach(function(d){
        d.publishedDate = new Date(d.published);
    });


    var firstPublishedDate = instagram_data[0].publishedDate;
    var lastPublishedDate = instagram_data[instagram_data.length - 1].publishedDate;

    var timeScale = d3.scale.linear()
        .domain([firstPublishedDate, lastPublishedDate])
        .range([0, width]);


    d3.select('#timeseries').append('svg')
        .attr('width', width + 'px')
        .attr('height', '40px')
        .selectAll('.vline')
        .data(data)
        .enter()
        .append('line')
        .attr("x1", function(d) {
            return timeScale(d.publishedDate);
        })
        .attr("x2", function(d) {
            return timeScale(d.publishedDate);
        })
        .attr("y1", function(d) {
            return 0;
        })
        .attr("y2", height)
        .style("stroke", "#000");

});