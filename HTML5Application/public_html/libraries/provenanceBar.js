

function drawHistory(visualElement, csvPath) {

    var margin = {top: 5, right: 2, bottom: 5, left: 2},
        width = 150- margin.left - margin.right,
        height = 750- margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(visualElement)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

}
