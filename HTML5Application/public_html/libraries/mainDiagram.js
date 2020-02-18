/**
 * This script manages animation, drawing and coordination of main diagram
 */

// Function to put to back a point of the scatterplot
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {this.parentNode.insertBefore(this, firstChild);}
    });
};
// Function to put to front a point of the scatterplot
d3.selection.prototype.moveToFront = function() {
    return this.each(function(){this.parentNode.appendChild(this);});
};

// Drawing of main diagram
function drawMainDiagram(visualElement, data) {

    header = d3.keys(data[0]);

    // margin2 is hdi axes, margin3 is gdp axes
    var margin = {top: 5, right: 45, bottom: 120, left: 150},
        margin2 = {top: 330, right: 45, bottom: 45, left: 150},
        margin3 = {top: 5, right: 935, bottom: 120, left: 55},
        width = 1050 - margin.left - margin.right,
        width3 = 1050 - margin3.left - margin3.right,
        height = 430 - margin.top - margin.bottom,
        height2 = 430 - margin2.top - margin2.bottom;

    // Qualitative scale from colorbrewer
    var colors = {
        Europe: "#377eb8",
        Antartide: "#e41a1c",
        Asia: "#4daf4a",
        Americas: "#984ea3",
        Oceania: "#ff7f00",
        Africa: "#ffff33"
    };

    // Function to draw the main scatterplot with points
    function drawScatter(data) {

        // Define values to show on axes
        var x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            x3 = d3.scaleLinear().range([0, width3]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]),
            y3 = d3.scaleLinear().range([height, 0]);

        // Define axes
        var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y),
            yAxis3 = d3.axisLeft(y3);

        // Define the area to zoom and move between values (rectangles on axes)*/
        var brushX = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush", brushedX);

        var brushY = d3.brushY()
            .extent([[0, 0], [width3, height]])
            .on("brush", brushedY);

        var brushTot = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("end", selected);

        var focus;

        if(document.getElementById("dotG") == null) {

            var svg = d3.select(visualElement).append("div").attr("id", "mainChange")
                .append("svg")
                .attr("id", "generalSvg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            var div = d3.select(visualElement)
                .append("div").attr("class", "tooltip")
                .attr("id", "mainTooltip")
                .style("visibility", "hidden");

            var context3 = svg.append("g")
                .attr("class", "context")
                .attr("transform", "rotate(90)")
                .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

                focus = svg.append("g")
                    .attr("class", "focus")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var dom = d3.extent(data, function (d) {return +d[header[0]];});
                x.domain([dom[0] - 2, dom[1] + 2]);
                dom = d3.extent(data, function (d) {return +d[header[1]];});
                y.domain([dom[0] - 2, dom[1] + 2]);

                x2.domain(x.domain());
                y2.domain(y.domain());
                x3.domain(x.domain());
                y3.domain(y.domain());


            // Append scatter plot to main chart area
            var dots = focus.append("g").attr("id", "dotG");
            dots.attr("class", "brushT")
                .call(brushTot);
            dots.attr("clip-path", "url(#clip)");
            dots.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr('class', 'dot')
                .attr("opacity", "0.55")
                .style("stroke", "#000")
                .style("stroke-width", "0.2px")
                .attr("cx", function (d) {return x(+d[header[0]]);})
                .attr("cy", function (d) {return y(+d[header[1]]);})
                .style("fill", function (d) {return colors[d["continent"]];})
                .on("mouseover", function (d, i) {
                    var elem = d3.select(this);
                    elem.transition()
                        .duration(50)
                        .attr('opacity', '1');
                    elem.style("stroke","#fff")
                        .style("stroke-width","1.5px");
                    //elem.moveToFront();

                    div.transition()
                        .duration(50)
                        .style("visibility", "visible");

                    div.html(d.country + "<br>POPULATION: " + d.population + "<br>SUICIDES: " +
                        (((d.tot_suicides) * 100000) / (d.population)).toFixed(2) +
                        "(per 100k)<br>GDP: " + d.gdp_per_year + "<br>HDI: " + d.hdi)
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY + 5) + "px");

                    if (document.getElementById("svgScatter") != null) {
                        d3.select("#svgScatter").selectAll(".secondCircle")
                            .each(function (p) {
                                if (p.country == d.country) {

                                    var x = d3.select(this).attr("cx")
                                    var y = parseFloat(d3.select(this).attr("cy")) + 535
                                    console.log(x, y, p)

                                    d3.select(this).moveToFront();
                                    d3.select("#mainDiagram").select("#scatterTooltip")
                                        .transition()
                                        .duration('50')
                                        .style("visibility", "visible");
                                    d3.select("#mainDiagram").select("#scatterTooltip")
                                        .html(p.country)
                                        .style("left", x + "px")
                                        .style("top", y + "px");
                                }
                            })
                            .style("stroke", function (p) {
                                if (p.country == d.country) {
                                    return "#fff";
                                }
                            })
                            .style("stroke-width", function (p) {
                                if (p.country == d.country) {
                                    return "1.5px";
                                }
                            });
                    }
                    if (document.getElementById("svgParallel") != null) {
                        d3.select("#svgParallel").selectAll(".innerPath").transition()
                            .style("opacity", function (p) {
                                if (p.country == d.country) {return "1";}
                                else {return "0.3";}
                            })
                            .style("stroke", function (p) {
                                if (p.country == d.country) {return "#e41a1c";}
                                else {return "#2ca25f";}
                            });
                    }
                })
                .on('mouseout', function (d, i) {
                    var elem = d3.select(this);
                    //elem.moveToBack();

                    elem.transition()
                        .duration('50')
                        .attr('opacity', '0.55');

                        if (selectedCountries.includes(elem.country)) {
                            elem.style("stroke", "red")
                                .style("stroke-width", "0.9px");
                        }else{
                            elem.style("stroke", "#000")
                            .style("stroke-width", "0.2px");}

                    d3.select("#mainDiagram").selectAll(".tooltip")
                        .transition()
                        .duration('50')
                        .style("visibility", "hidden");

                    if (document.getElementById("svgScatter") != null) {
                        d3.select("#svgScatter").selectAll(".secondCircle")
                            .each(function (p) {
                                if (p.country == d.country) {
                                    d3.select(this).moveToBack();
                                }
                            })
                            .style("stroke", function (p) {
                                if (p.country == d.country) {
                                    return "#000";
                                }
                            })
                            .style("stroke-width", function (p) {
                                if (p.country == d.country) {
                                    return "0.2px";
                                }
                            });
                    }
                    if (document.getElementById("svgParallel") != null) {
                        d3.select("#svgParallel").selectAll(".innerPath").transition()
                            .style("opacity", function (d) {
                                if (selectedCountries.includes(d.country)) {return "1";}
                                if ((selectionData != null && selectionData.length == 2)
                                    && ((d["X"]) > selectionData[0][0]) && ((d["X"]) < selectionData[1][0]) &&
                                    ((d["Y"]) < selectionData[0][1]) && ((d["Y"]) > selectionData[1][1])) {
                                    return "1";
                                }
                                else {return "0.3";}
                            })
                            .style("stroke", function (d) {
                                if (selectedCountries.includes(d.country)) {return "#e41a1c";}
                                if ((selectionData != null && selectionData.length == 2)
                                    && ((d["X"]) > selectionData[0][0]) && ((d["X"]) < selectionData[1][0]) &&
                                    ((d["Y"]) < selectionData[0][1]) && ((d["Y"]) > selectionData[1][1])) {
                                    return "#e41a1c";
                                }
                                else {return "#2ca25f";}
                            });
                    }
                });

        d3.select("#dotG").selectAll(".dot")
            .transition().duration("800")
                .attr("r", function (d) {return (((d.tot_suicides) * 100000) / (d.population));})

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);
        focus.append("text")
            .attr("y", 0 + margin.left)
            .attr("x", 0 - (height / 2) + 25)
            .attr("dy", "1em")
            .style("transform", "rotate(90)")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("Y");

        svg.append("text")
            .attr("y", (height + margin.top + margin.bottom) - 20)
            .attr("x", ((width + margin.right + margin.left) / 2) + 10)
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "black")
            .text("X");

        }
        else{
            var dom = d3.extent(data, function (d) {return +d[header[0]];});
            x.domain([dom[0] - 2, dom[1] + 2]);
            dom = d3.extent(data, function (d) {return +d[header[1]];});
            y.domain([dom[0] - 2, dom[1] + 2]);

            x2.domain(x.domain());
            y2.domain(y.domain());
            x3.domain(x.domain());
            y3.domain(y.domain());

            //update axis X Y
            focus = d3.select(".focus");

        }

        if(document.getElementById("contextX") == null) {
            var context = svg.append("g")
                .attr("class", "context")
                .attr("id", "contextX")
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
            // append scatter plot to brush chart areaX
            var dots = context.append("g");
            dots.attr("clip-path", "url(#clip)");
            dots.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr('class', 'dotContext')
                .attr("r", 2)
                .style("opacity", "0.2")
                .attr("cx", function (d) {return x2(d[header[0]]);})
                .attr("cy", function (d) {return y2(d[header[1]]);})
                .style("fill", function (d) {return colors[d.continent];});

            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "brush")
                .call(brushX)
                .call(brushX.move, x2.range());
        }
        else{
            d3.select("#contextX").selectAll(".dotContext")
                .data(data)
                .transition()
                .duration("500")
                .attr("cx", function (d) {return x2(+d[header[0]]);})
                .attr("cy", function (d) {return y2(+d[header[1]]);})
                .style("fill", function (d) {return colors[d.continent];});

            //update axis X
            context = d3.select("#contextX");
            context.select(".axis.axis--x")
                .transition().duration("500")
                .call(xAxis2);

            context.select(".brush")
                .call(brushX)
                .call(brushX.move, x2.range())

        }

        if(document.getElementById("contextY") == null) {
            var context3 = svg.append("g")
                .attr("class", "context")
                .attr("id", "contextY")
                .attr("transform", "rotate(90)")
                .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

            // append scatter plot to brush chart areaY
            var dots = context3.append("g");
            dots.attr("clip-path", "url(#clip)");
            dots.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr('class', 'dotContext')
                .attr("r", 2)
                .style("opacity", .5)
                .attr("cx", function (d) {return x3(d[header[0]]);})
                .attr("cy", function (d) {return y3(d[header[1]]);})
                .style("fill", function (d) {return colors[d.continent];});

            context3.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis3);

            context3.append("g")
                .attr("class", "brush")
                .call(brushY)
                .call(brushY.move, (y3.range()).reverse())
                .selectAll("rect")
                .attr("y", 0)
                .attr("height", height);
        } else {
            d3.select("#contextY").selectAll(".dotContext")
                .data(data)
                .transition()
                .duration("500")
                .attr("cx", function (d) {return x3(+d[header[0]]);})
                .attr("cy", function (d) {return y3(+d[header[1]]);})
                .style("fill", function (d) {return colors[d.continent];});

            //update axis X Y
            context3 = d3.select("#contextY");
            context3.select(".axis.axis--y")
                .transition().duration("500")
                .call(yAxis3);

            context3.select(".brush")
                .call(brushY)
                .call(brushY.move, (y3.range()).reverse())
                .selectAll("rect").transition().duration("500")
                .attr("y", 0)
                .attr("height", height);

            //main diagram update
            d3.select("#dotG").selectAll(".dot")
                .data(data)
                .transition()
                .duration("500")
                .attr("cx", function (d) {return x(+d[header[0]]);})
                .attr("cy", function (d) {return y(+d[header[1]]);})
                .attr("r", function (d) {return (((d.tot_suicides) * 100000) / (d.population));})
                .style("fill", function (d) {return colors[d.continent];});

            focus.select(".axis.axis--x")
                .transition().duration("500")
                .call(xAxis);

            focus.select(".axis.axis--y")
                .transition().duration("500")
                .call(yAxis);

            focus.select(".brushT")
                .call(brushTot);
        }


        // Redraw scatterplot with selection
        function brushedX() {
            var selection = d3.event.selection;
            x.domain(selection.map(x2.invert, x2));
            focus.selectAll(".dot")
                .attr("cx", function (d) {return x(d[header[0]]);})
                .attr("cy", function (d) {return y(d[header[1]]);});
            focus.select(".axis--x").call(xAxis);
        }

        function brushedY() {
            var selection = d3.event.selection;
            selection = [selection[1], selection[0]]
            y.domain(selection.map(y3.invert, y3));
            focus.selectAll(".dot")
                .attr("cx", function (d) {return x(d[header[0]]);})
                .attr("cy", function (d) {return y(d[header[1]]);});
            focus.select(".axis--y").call(yAxis);
        }

        function selected() {
            var selection = d3.event.selection, svgFromSelect=null;
// Coordination MAIN DIAGRAM
            // Case selection NOT null
            if (selection != null) {
                selectionData = [[x.invert(selection[0][0]), y.invert(selection[0][1])],
                    [x.invert(selection[1][0]), y.invert(selection[1][1])]];
                focus.selectAll(".dot").transition()
                    .style("fill", function (d) {
                        if ((x(d[header[0]]) > selection[0][0]) && (x(d[header[0]]) < selection[1][0]) &&
                            (y(d[header[1]]) > selection[0][1]) && (y(d[header[1]]) < selection[1][1])) {
                            return colors[d.continent];
                        } else {
                            return "gray";
                        }
                    })
                    .style("fill-opacity", function (d) {
                        if ((x(d[header[0]]) > selection[0][0]) && (x(d[header[0]]) < selection[1][0]) &&
                            (y(d[header[1]]) > selection[0][1]) && (y(d[header[1]]) < selection[1][1])) {
                            return "1.0"
                        } else {
                            return "0.2"
                        }
                    })
            }
            // Case selection NULL
            else {
                selectionData = null;
                var filteredData = filterAllDataBrusher(data, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1])
                d3.select("#dotG").selectAll(".dot").transition().duration("50")
                    .style("fill", function(d){
                        if (filteredData[0].includes(d["country"])){
                            return colors[d["continent"]];}
                        else{
                            return "gray";}
                    })
                    .style("fill-opacity", "1.0")
            }

// Coordination STATISTICAL DIAGRAMS
            // Case selection NOT null or there are SELECTED COUNTRIES
            if (selection != null || selectedCountries.length != 0) {

    // Coordination LINEAR CHART
                /*
                 if (document.getElementById("svgLinear") != null) {
                     var dataNoNull = filterOutNullRecords(dataFull)
                     var dataNoNull1= filterCountry(dataNoNull, selectedCountries);

                     var filteredDataMap = filterAllDataCheckbox(dataNoNull1, male, female, age5_14, age15_24, age25_34,
                         age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
                         genMillenials, genZ);

                     d3.select("#secondDiagram").selectAll("svg").remove();
                     svgFromSelect = drawLinearChart("#secondDiagram", filteredDataMap)
                 }
                 */

    // Coordination PARALLEL COORDINATES
                if (document.getElementById("svgParallel") != null) {

                    d3.select("#svgParallel").selectAll(".innerPath").transition()
                        .style("opacity", function (d) {
                            if (selectedCountries.includes(d.country)) {
                                return "1"
                            }
                            else if ((selectionData != null && selectionData.length == 2)
                                && ((x(d[header[0]]) > selection[0][0]) && (x(d[header[0]]) < selection[1][0]) &&
                                    (y(d[header[1]]) > selection[0][1]) && (y(d[header[1]]) < selection[1][1]))){
                                return "1"
                            }
                            else{
                                return "0.3"
                            }
                        })
                        .style("stroke", function (d) {
                            if (selectedCountries.includes(d.country)) {
                                return "#e41a1c"
                            }
                            else if ((selectionData != null && selectionData.length == 2)
                                && ((x(d[header[0]]) > selection[0][0]) && (x(d[header[0]]) < selection[1][0]) &&
                                    (y(d[header[1]]) > selection[0][1]) && (y(d[header[1]]) < selection[1][1]))){
                                return "#e41a1c"
                            }
                            else {
                                return "#2ca25f"
                            }
                        })

                    svgFromSelect =  document.getElementById("svgParallel");

                }

    // Coordination SCATTER PLOT
                if (document.getElementById("svgScatter") != null) {

                    d3.select("#svgScatter").selectAll("circle")
                        .style("opacity", function (d) {
                            if (selectedCountries.includes(d.country)) {
                                return "1"
                            }
                            else if ((selectionData != null && selectionData.length == 2)
                                && ((x(d[header[0]]) > selection[0][0]) && (x(d[header[0]]) < selection[1][0]) &&
                                    (y(d[header[1]]) > selection[0][1]) && (y(d[header[1]]) < selection[1][1]))){
                                return "1"
                            } else {
                                return "0.1"
                            }
                        })
                svgFromSelect =  document.getElementById("svgScatter");
                }

    // Coordination PATTERN BARCHARTS
                /*  if (document.getElementById("patternDiv") != null) {
                      var dataYearNoNull = filterOutNullRecords(dataYear)
                      var dataYearNoNull1  = filterCountry(dataYearNoNull, selectedCountries);
                      var tmpDataMap2 = filterAllDataBrusher(dataYearNoNull1, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1])
                      filteredDataMap = filterAllDataCheckbox(tmpDataMap2[1], male, female, age5_14, age15_24, age25_34,
                          age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
                          genMillenials, genZ);

                      d3.select("#secondDiagram").selectAll("div").remove();
                      d3.select("#secondDiagram").selectAll("svg").remove();
                      svgFromSelect = drawPatternBarchart("#secondDiagram", filteredDataMap)
                  }*/

            }
            // Case: selection NULL and NOT SELECTED COUNTRIES
            else {

                if (document.getElementById("svgParallel") != null) {
                    d3.select("#svgParallel").selectAll(".innerPath")
                        .style("stroke", "#2ca25f");

                    d3.select("#svgParallel").selectAll(".innerPath").transition()
                        .style("opacity", "0.3");
                    svgFromSelect =  document.getElementById("svgParallel");
                }
                if (document.getElementById("svgScatter") != null) {
                    d3.select("#svgScatter").selectAll("circle")
                        .style("opacity", "1");
                    svgFromSelect =  document.getElementById("svgScatter");
                }
                if (document.getElementById("svgLinear") != null) {
                    var dataNoNull = filterOutNullRecords(dataFull)
                    filteredData = filterAllDataCheckbox(dataNoNull, male, female, age5_14, age15_24, age25_34,
                        age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
                        genMillenials, genZ);

                    d3.select("#secondDiagram").selectAll("svg").remove();
                    svgFromSelect = drawLinearChart("#secondDiagram", filteredData)

                }
                if (document.getElementById("patternDiv") != null) {

                    var dataYearNoNull = filterOutNullRecords(dataYear)
                    tmpData = filterAllDataBrusher(dataYearNoNull, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1])

                    filteredData = filterAllDataCheckbox(tmpData[1], male, female, age5_14, age15_24, age25_34,
                        age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
                        genMillenials, genZ);
                    d3.select("#secondDiagram").selectAll("svg").remove();
                    svgFromSelect = drawPatternBarchart("#secondDiagram", filteredData)
                }
            }
            document.getElementById("saveOnProvenance").onclick=function(){
                saveSvgFile("provenanceBar", svgFromSelect, svgs_to_save);}
        }

    }

    drawScatter(data)
}

