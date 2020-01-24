/* 
 * Script for the management of the parallel diagram containing the parameters
 * (Sex, Age, Generation, Year)
 */
function calculateRangeArray(numDiffValue, height){
    var rangeArray = [];
    for(i=0; i<numDiffValue; i++){
        rangeArray.push(height*(i/numDiffValue));
    }
    return rangeArray;
}

function drawParallelCoordinates(visualElement, csvPath){
    
    var margin = {top: 30, right: 40, bottom: 20, left: 200},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

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
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv(csvPath, function(data) {

    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    dimensions = d3.keys(data[0]).filter(function(d) { 
        return d != "country" && d != "suicides_no" && d != "population" && 
                d != "suicides/100k pop" && d != "country-year" && d != "hdi" 
                && d != " gdp_for_year ($) " && d != "gdp_per_capita ($)"})

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {}
    for (i in dimensions) {
      name = dimensions[i]
      switch(name){
          case "year":
              range = rangeYear;
              //console.log(range)
          case "age":
              range = rangeAge;
              //console.log(range)
          case "sex":
              range = rangeSex;
              //console.log(range)
          case "generation":
              range = rangeGeneration;
              //console.log(range)
          //default: range = [0, height]
      }
      console.log(name)
      y[name] = d3.scaleOrdinal()
        .domain( d3.extent(data, function(d) { return +d[name]; }) )
        .range(rangeYear)
    }

      // Build the X scale -> it find the best position for each Y axis
      x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

      // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
      function path(d) {
          return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
      }

      // Draw the lines
      svg
        .selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", "#69b3a2")
        .style("opacity", 0.5)

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
          .style("fill", "black")

    })
    
}