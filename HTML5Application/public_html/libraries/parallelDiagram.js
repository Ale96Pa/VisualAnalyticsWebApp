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


    
}