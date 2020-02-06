/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function filters(visualElement, data) {

    function newFilterBar(data, name) {

        var header = d3.keys(data[0]);
        var index = header.indexOf(name);

        var width = 550,
            height = 80;

        var x = d3.scaleLinear()
            .range([0, 350])
            .domain(d3.extent(data, function (d) {
                return +d[name];
            }));

        var xAxis = d3.axisBottom(x);

        var brush = d3.brushX()
            .extent([[0, 0], [350, 20]])
            .on("brush", brushed);

        var svg = d3.select(visualElement)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate( 30 , 10)");

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
            .attr("fill", "white")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("transform", "rotate(40)")
            .style("text-anchor", "start");

        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());

        function brushed() {
            var selection = d3.event.selection;
            console.log(selection.map(x.invert, x));
        }

    }

    newFilterBar(data, "population");
    newFilterBar(data, "gdp_per_capita ($)");
    newFilterBar(data, "hdi");
}

function selectionChoices(visualElement, data){

    function selectionBox(data, name) {
        var width = 200,
            height = 450;

        var div = d3.select(visualElement)
            .append("div")
            .attr("height", height)
            .attr("id",name +"Container")
            .attr("class", "container")
            .attr("transform", "translate( 30 , 10)")
            .append("legend")
            .html(name);


        nameKey = d3.map(data, function(d){return d[name];}).keys()
        nameKey.forEach(function(k){
            div.append('label')
                .text(k)
                .append("input")
                .attr("checked", true)
                .attr("type", "checkbox")
                .attr("id", k +"Box")
                .attr("onClick", "checked(this)");
        });
    };

    selectionBox(data,"generation");
    selectionBox(data,"sex");
    selectionBox(data,"age");


}

function worldMap(visualElement) {

    var margin = {top: 0, right: 10, bottom: 0, left: 20};
    var width = 500 ;
    var height = width / 2.2;

    var projection,path,svg,g;

    var zoom = d3.zoom()
        .scaleExtent([1, 9])
        .on("zoom", move);

    projection = d3.geoMercator()
        .translate([(width/2), (height/2)])
        .scale( width / 2 / Math.PI);

    path = d3.geoPath().projection(projection);

    svg = d3.select("#"+visualElement)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate( 30 , 10)")
        .style( "border-radius", "10%")
        .call(zoom)
        .append("g")

    svg.append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("height", height).attr("width", width)
        .style("stroke", "white")
        .style("fill", "none")
        .style( "stroke-radius", "10%")
        .style("stroke-width", "3");

    var div = d3.select("#"+visualElement)
        .append("div").attr("class", "tooltip")
        .attr("visibility","hidden");

    g = svg.append("g");

    d3.json("dataset/world.json")
        .then(function (world) {
            var countries = topojson.feature(world, world.objects.countries).features;

            topo = countries;
            draw(topo);
        });


    function draw(topo) {

        var country = g.selectAll(".country").data(topo);
        var states = data.map(function(p){return p.country})
        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d,i) { return d.id; })
            .attr("title", function(d,i) { return d.properties.name; })
            .style("fill", function(d, i) {
                if (states.includes(d.properties.name) ){
                    return d.properties.color;}
                else{
                return "gray";}
            })
            .on("mouseover", function(d,i) {
                d3.select(this)
                    .transition()
                    .duration('50')
                    .attr('opacity', '1')

                div.transition()
                    .duration(50)
                    .style("visibility", "visible");

                div.html(d.properties.name)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 25) + "px");

            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');

                div.transition()
                    .duration('50')
                    .style("visibility", "hidden");
            })
            .on("click",function(d,i) {
                console.log(d.properties.name);
            });

    }


    function move() {
        //var t = d3.event.translate;
        var t = [d3.event.transform.x,d3.event.transform.y];
        //var s = d3.event.scale;
        var s = d3.event.transform.k;
        zscale = s;
        var h = height/4;

        t[0] = Math.min(
            (width/height)  * (s - 1),
            Math.max( width * (1 - s), t[0] )
        );

        t[1] = Math.min(
            h * (s - 1) + h * s,
            Math.max(height  * (1 - s) - h * s, t[1])
        );

        g.attr("transform", "translate(" + t + ")scale(" + s + ")");

        d3.selectAll(".country").style("stroke-width", 1.5 / s);

    }

}






