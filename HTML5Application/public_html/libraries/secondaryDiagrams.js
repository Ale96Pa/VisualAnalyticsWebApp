function drawLinearChart(visualElement,data){

    // set the dimensions and margins of the graph
    var margin = {top: 25, right: 15, bottom: 35, left: 85},
        width = 850 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    filteredDataBoomers = data.filter(function(row) {
        return row['generation'] === 'Boomers';
    });
    filteredDataSilent = data.filter(function(row) {
        return row['generation'] === 'Silent';
    });
    filteredDataGenX = data.filter(function(row) {
        return row['generation'] === 'Generation X';
    });
    filteredDataMillenials = data.filter(function(row) {
        return row['generation'] === 'Millenials';
    });
    filteredDataGenGI = data.filter(function(row) {
        return row['generation'] === 'G.I. Generation';
    });
    filteredDataGenZ = data.filter(function(row) {
        return row['generation'] === 'Generation Z';
    });

    var gen = [filteredDataBoomers,filteredDataGenZ,filteredDataSilent,filteredDataGenX,
        filteredDataMillenials, filteredDataGenGI];
    var legendKeys = ["Boomers", "Generation X", "Silent","Millenials",
        "G,I. Generation", "Generation Z"]

    gen.forEach(function(generation, index){
        var count = {};
        for (var i = 0; i < generation.length; i++) {
            var arr = generation[i]
            if (arr['year'] in count) {
                count[arr['year']] = parseInt(count[arr['year']]) + parseInt(arr['suicides_no'])
            } else {
                count[arr['year']] = parseInt(arr['suicides_no'])
            }
        }
        generation = [];
        for (var key in count) {
            generation.push({year: key, suicides_no: count[key]});
        };

        gen[index] = generation;
    });

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data
    var years = gen[0].map(function(d) { return d.year });
    var int_years = years.map(Number);
    x.domain(d3.extent(int_years));
    
    var suicNum = gen[0].map(function(d) { return d.suicides_no });
    var int_suic = suicNum.map(Number);
    y.domain([0, d3.max(int_suic)]);

    var valueline = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.suicides_no); });

    var color = d3.scaleOrdinal()
        .range(["red", "green", "blue", "yellow", "white", "darkgreen"]);

    var svg = d3.select(visualElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var legend = d3.select(visualElement).append("svg")
        .attr("width", "105px")
        .attr("top",  margin.top)
        .attr("left", width + margin.left + 55);

    gen.forEach(function(generation, index) {
        // Add the valueline path.
        svg.append("path")
            .data([generation])
            .attr("class", "line")
            .style("stroke", function(){ return color(index)})
            .style("fill", "none")
            .style("stroke-width","2")
            .attr("d", valueline);

        legend.append('rect')
            .attr("width", "13px")
            .attr("height", "13px")
            .attr('y', function(){ return (index * 20);})
            .style("fill",function(){ return color(index)});

        legend.append('text')
            .attr("x", "20")
            .attr("font-size"," small")
            .attr('y', function(){ return (index * 20) + 12;})
            .text(legendKeys[index]);
    })
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("cx", suicNum);

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .attr("cy", years);
}


//TODO: clusterization depending on hdi
function drawScatterplot(visualElement, data){
    var margin = {top: 25, right: 15, bottom: 35, left: 85},
        width = 850 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    padding = 50;

    //max vs min
    var numSuic = data.map(function(d) { return d.suicides_no });
    var gdp = data.map(function(d) { return d.gdp_per_capita });

    var dataset = [];
    for (var i = 0; i < numSuic.length; i++) {
        dataset[i] = [gdp[i], numSuic[i]];
    }

    //scale function
    var xScale = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d["gdp_per_capita"]; })])
            .range([0, width]);

    var yScale = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d["suicides_no"]; })])
            .range([height , 0]);

    var xAxis = d3.axisBottom().scale(xScale);

    var yAxis = d3.axisLeft().scale(yScale);
/*
    console.log( yScale(d3.max(dataset, function(d) { return +d[1]; })))
    console.log( yScale(d3.min(dataset, function(d) { return +d[1]; })))
    console.log( xScale(d3.max(dataset, function(d) { return +d[0]; })))
    console.log( xScale(d3.min(dataset, function(d) { return +d[0]; })))
*/
    //create svg element
    var svg = d3.select(visualElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                    return xScale(d[0]);
            })
            .attr("cy", function(d) {
                    return yScale(d[1]);
            })
            .attr("r", 5)
            .attr("stroke", "black")
            .attr("fill", "darkgreen");


    //x axis
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height+5) + ")")
            .call(xAxis);

    //y axis
    svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(-5,0)")
            .call(yAxis);
}


function drawBarChart(visualElement, data){
    var margin = {top: 5, right: 5, bottom: 5, left: 5},
        width = 150 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;
    
    var svg = d3.select(visualElement).append("svg");
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1);

    var y = d3.scaleLinear()
            .rangeRound([height, 0]);

    x.domain(data.map(function (d) {
                    return d.sex;
            }));
    y.domain([0, d3.max(data, function (d) {
                            return Number(d.suicides_no);
                    })]);

    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "white")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("suicides_no");

    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
            return x(d.sex);
    })
    .attr("y", function (d) {
            return y(Number(d.suicides_no));
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
            return height - y(Number(d.suicides_no));
    });

}

 function drawLinearChart2(visualElement, data){
     
    // 2. Use the margin convention practice 
    var margin = {top: 5, right: 5, bottom: 5, left: 5},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // 1. Add the SVG to the page and employ #2
    var svg = d3.select(visualElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // The number of datapoints
    var n = data.length;
    //console.log(n)

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, n-1]) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
        .domain([0, 1]) // input 
        .range([height, 0]); // output 

    // 7. d3's line generator
    var line = d3.line()
        .x(function(d,i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
        .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } });
    console.log(dataset);

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
        .datum(dataset) // 10. Binds data to the line 
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

    // 12. Appends a circle for each datapoint 
    svg.selectAll(".dot")
        .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(i) })
        .attr("cy", function(d) { return yScale(d.y) })
        .attr("r", 5)
/*        .on("mouseover", function(a, b, c) { 
            console.log(a) 
            this.attr('class', 'focus')
        })
        .on("mouseout", function() {  })
        .on("mousemove", mousemove);

       var focus = svg.append("g")
           .attr("class", "focus")
           .style("display", "none");

       focus.append("circle")
           .attr("r", 4.5);

       focus.append("text")
           .attr("x", 9)
           .attr("dy", ".35em");

       svg.append("rect")
           .attr("class", "overlay")
           .attr("width", width)
           .attr("height", height)
           .on("mouseover", function() { focus.style("display", null); })
           .on("mouseout", function() { focus.style("display", "none"); })
           .on("mousemove", mousemove);

       function mousemove() {
         var x0 = x.invert(d3.mouse(this)[0]),
             i = bisectDate(data, x0, 1),
             d0 = data[i - 1],
             d1 = data[i],
             d = x0 - d0.date > d1.date - x0 ? d1 : d0;
         focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
         focus.select("text").text(d);
       }
*/
 }
