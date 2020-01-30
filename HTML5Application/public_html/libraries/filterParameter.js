/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function filters(visualElement) {

    var margin = {top: 10, right: 20, bottom: 500, left: 20},
        width = 650 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, 300])
        .domain([0,300]);

    var xAxis = d3.axisBottom(x);

    var brush = d3.brushX()
        .extent([[0, 0], [300, 25]])
        .on("brush", brushed);

    var svg = d3.select(visualElement)
        .append("svg")
        .attr("width", 550)
        .attr("height", 100);

    svg.append("text")
        .attr("transform", "translate(50,50)")
        .style("text-anchor", "middle")
        .text("Population:");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(100,30)");

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0,13)")
        .call(xAxis);

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

}

    function brushed() {
        var selection = d3.event.selection;
        console.log(selection)
    }

    function selected(){
        dataSelection=[]

        var selection= d3.event.selection;

        if (selection != null){
            focus.selectAll(".dot")

                .style("opacity",function(d){
                    if ((x(d[chiavi[0]]) > selection[0][0]) && (x(d[chiavi[0]]) < selection[1][0]) && (y(d[chiavi[1]]) > selection[0][1]) && (y(d[chiavi[1]]) < selection[1][1])) {
                        dataSelection.push(d.id)
                        return "1.0"
                    }
                    else
                    {
                        return "0.3"
                    }
                })
        }
        else
        {
            focus.selectAll(".dot")
                .style("fill",function(d) {return color(d[chiavi[2]]); })
                .style("opacity",".3")
            console.log("reset");
        }

        d3.select("#parallelArea").selectAll(".forepath")
            .style("stroke","steelblue")

        var c=d3.select("#parallelArea").selectAll(".forepath")
            .style("stroke",function(d){
                if ((x(d[chiavi[0]]) > selection[0][0]) && (x(d[chiavi[0]]) < selection[1][0]) && (y(d[chiavi[1]]) > selection[0][1]) && (y(d[chiavi[1]]) < selection[1][1])) {
                    dataSelection.push(d.id)
                    return "red"
                }
                else
                {
                    return "steelblue"
                }


            })
        console.log(c)
    }



