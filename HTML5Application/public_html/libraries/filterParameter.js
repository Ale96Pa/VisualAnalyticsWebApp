/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function filters(visualElement, data) {

    function newFilterBar(data,name,topPx) {

    var header = d3.keys(data[0]);
    var index = header.indexOf(name);

    var width = 550,
        height = 90;

    var x = d3.scaleLinear()
        .range([0, 350])
        .domain( d3.extent(data, function(d) { return +d[name]; }) );

    var xAxis = d3.axisBottom(x);

    var brush = d3.brushX()
        .extent([[0, 0], [350, 20]])
        .on("brush", brushed);

    var svg = d3.select(visualElement)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate( 50 , 20)");

    svg.append("text")
        .attr("transform", "translate(50,30)")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(name + ":");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(100,15)");

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0,17)")
        .attr("fill","white")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

        function brushed() {
            var selection = d3.event.selection;
            //console.log(selection.map(x.invert, x));
        }
    }

    newFilterBar(data,"population");
    newFilterBar(data,"hdi");
    newFilterBar(data, "gdp");

}






