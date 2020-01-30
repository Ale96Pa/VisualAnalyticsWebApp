

function drawMainDiagram(visualElement, csvPath) {

    /*2 is hdi axes, 3 is gdp axes*/
    var margin = {top: 50, right: 25, bottom: 105, left: 150},
        margin2 = {top: 480, right: 25, bottom: 30, left: 150},
        margin3 = {top: 50, right: 950, bottom: 105, left: 40},
        width = 1050 - margin.left - margin.right,
        width3 = 1050 - margin3.left - margin3.right
        height = 550 - margin.top - margin.bottom,
        height2 = 550 - margin2.top - margin2.bottom;

/*Define values to show on axes*/
    var x = d3.scaleLinear().range([0, width]),
        x2 = d3.scaleLinear().range([0, width]),
        x3 = d3.scaleLinear().range([0, width3]),
        y = d3.scaleLinear().range([height, 0]),
        y2 = d3.scaleLinear().range([height2, 0]),
        y3 = d3.scaleLinear().range([height, 0]);

/*define axes*/
    var xAxis = d3.axisBottom(x),
        xAxis2 = d3.axisBottom(x2),
        yAxis = d3.axisLeft(y),
        yAxis3 = d3.axisLeft(y3);

    /*brushes define the area to zoom and move between values (rettangolone su assi)*/
    var brushX = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush", brushedX);

    var brushY = d3.brushY()
        .extent([[0, 0], [width3, height]])
        .on("brush", brushedY);

    var brushTot = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("end", selected);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var focus;

    function drawScatter(data) {
        var svg = d3.select(visualElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        var context3 = svg.append("g")
            .attr("class", "context")
            .attr("transform", "rotate(90)")
            .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

        focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


        x.domain(d3.extent(data, function (d) {
            return +d[chiavi[0]];
        }));
        y.domain(d3.extent(data, function (d) {
            return +d[chiavi[1]];
        }));
        x2.domain(x.domain());
        y2.domain(y.domain());
        x3.domain(x.domain());
        y3.domain(y.domain());


// append scatter plot to main chart area
        var dots = focus.append("g");
        dots.attr("clip-path", "url(#clip)");
        dots.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dot')
            .attr("r", 5)
            .attr("fill", "grey")
            .attr("opacity", ".3")
            .attr("cx", function (d) {
                return x(+d[chiavi[0]]);
            })
            .attr("cy", function (d) {
                return y(+d[chiavi[1]]);
            })
            .style("fill", function (d) {
                return color(d[chiavi[2]]);
            });

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        focus.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left )
            .attr("x", 0 - (height / 2) + 20)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "white")
            .text("Y");

        svg.append("text")
            .attr("y", (height + margin.top + margin.bottom) )
            .attr("x", ((width + margin.right + margin.left) / 2) + 20)
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "white")
            .text("X");

        focus.append("g")
            .attr("class", "brushT")
            .call(brushTot);


        // append scatter plot to brush chart areaY
        var dots = context3.append("g");
        dots.attr("clip-path", "url(#clip)");
        dots.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dotContext')
            .attr("r", 3)
            .style("opacity", .5)
            .attr("cx", function (d) {
                return x3(d[chiavi[0]]);
            })
            .attr("cy", function (d) {
                return y3(d[chiavi[1]]);
            })
            .style("fill", function (d) {
                return color(d[chiavi[2]]);
            });

        context3.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis3);

        context3.append("g")
            .attr("class", "brush")
            .call(brushY)
            .call(brushY.move, y3.range())
            .selectAll("rect")
            .attr("y", 0)
            .attr("height", height);

        // append scatter plot to brush chart areaX
        var dots = context.append("g");
        dots.attr("clip-path", "url(#clip)");
        dots.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dotContext')
            .attr("r", 3)
            .style("opacity", .5)
            .attr("cx", function (d) {
                return x2(d[chiavi[0]]);
            })
            .attr("cy", function (d) {
                return y2(d[chiavi[1]]);
            })
            .style("fill", function (d) {
                return color(d[chiavi[2]]);
            });

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        context.append("g")
            .attr("class", "brush")
            .call(brushX)
            .call(brushX.move, x2.range());
    }


    d3.csv(csvPath, function (error, data) {

        chiavi = d3.keys(data[0])
        if (error) throw error;
        var l = data.length;
        for (i = 0; i < l; i++) {
            data[i].id = i
        }

        drawScatter(data)

    });



    //create brush function redraw scatterplot with selection
    function brushedX() {
        var selection = d3.event.selection;
        console.log(selection)
        x.domain(selection.map(x2.invert, x2));
        focus.selectAll(".dot")
            .attr("cx", function(d) { return x(d[chiavi[0]]); })
            .attr("cy", function(d) { return y(d[chiavi[1]]); });
        focus.select(".axis--x").call(xAxis);
    }

    function brushedY() {
        var selection = d3.event.selection;
        console.log(selection)
        y.domain(selection.map(y3.invert, y3));
        focus.selectAll(".dot")
            .attr("cx", function(d) { return x(d[chiavi[0]]); })
            .attr("cy", function(d) { return y(d[chiavi[1]]); });
        focus.select(".axis--y").call(yAxis);
    }



    function selected() {
        dataSelection = []
        var selection = d3.event.selection;

        if (selection != null) {
            focus.selectAll(".dot")

                .style("opacity", function (d) {
                    if ((x(d[chiavi[0]]) > selection[0][0]) && (x(d[chiavi[0]]) < selection[1][0]) && (y(d[chiavi[1]]) > selection[0][1]) && (y(d[chiavi[1]]) < selection[1][1])) {
                        dataSelection.push(d.id)
                        return "1.0"
                    } else {
                        return "0.3"
                    }
                })


        } else {
            focus.selectAll(".dot")
                .style("fill", function (d) {
                    return color(d[chiavi[2]]);
                })
                .style("opacity", ".3")
        }
    }
}