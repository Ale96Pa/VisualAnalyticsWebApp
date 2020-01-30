

function drawAdditionalDiagram(visualElement, csvPath) {

    var margin = {top: 5, right: 5, bottom: 5, left: 5},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(visualElement)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 }