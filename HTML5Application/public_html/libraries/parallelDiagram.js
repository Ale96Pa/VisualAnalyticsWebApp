/* 
 * Script for the management of the parallel diagram containing the parameters
 * (Sex, Age, Generation, Year)
 */

//TODO: RIVEDERE TUTTI I COMMENTI E FARLI BENE
function calculateRangeArray(numDiffValue, height){
    var rangeArray = [];
    for(i=0; i<numDiffValue; i++){
        rangeArray.push(height*(i/(numDiffValue)));
    }
    rangeArray.push(height);
    return rangeArray.reverse();
}

function drawParallelCoordinates(visualElement, csvPath){
    
    var margin = {top: 450, right: 20, bottom: 50, left: 20},
    width = 650 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

    var rangeSex = calculateRangeArray(2, height);
    var rangeAge = calculateRangeArray(6, height);
    var rangeGeneration = calculateRangeArray(6, height);
    var rangeYear = calculateRangeArray(28, height);
    
    // append the svg object to the body of the page
    var svg = d3.select(visualElement)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv(csvPath, function(data) {

        // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
        dimensions = d3.keys(data[0]).filter(function(d) { 
            return d != "country" && d != "suicides_no" && d != "population" && 
                    d != "suicides/100k pop" && d != "country-year" && d != "hdi" 
                    && d != " gdp_for_year ($) " && d != "gdp_per_capita ($)"})

        // For each dimension, I build a ordinal scale. I store all in a y object
        var y = {};
        for (i in dimensions) {
            name = dimensions[i];
            if (name === "year"){range = rangeYear;}
            if (name === "age"){range = rangeAge;}
            if (name === "sex"){range = rangeSex;}
            if (name === "generation"){range = rangeGeneration;}

            y[name] = d3.scaleOrdinal()
                .range(range)
                //.domain( d3.extent(data, function(d) { return +d[name]; }) );
                .domain( data.map(function(d) { return +d[name];}).sort());
        }

        // Build the X scale -> it find the best position for each Y axis
        x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(dimensions);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function(p) {return [x(p), y[p](d[p])]; }));
        }

        // Draw the lines
        svg.selectAll("myPath")
            .data(data)
            .enter().append("path")
            .attr("d",  path)
            .style("fill", "none")
            .style("stroke", "#69b3a2")
            .style("opacity", 0.5);

        // Draw the axis:
        svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(dimensions).enter()
            .append("g")
            // I translate this element to its right position on the x axis
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            // And I build the axis with the call function
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black");
    });
}