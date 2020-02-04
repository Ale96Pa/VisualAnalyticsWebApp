function drawLinearChart(visualElement, data){
    // set the dimensions and margins of the graph
    var margin = {top: 5, right: 5, bottom: 5, left: 5},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    
    // define the 1st line
    filteredDataBoomers = data.filter(function(row) {
            return row['generation'] === 'Boomers';
    });
    var valueline1 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.suicides_no); });

    // define the 2nd line
    filteredDataSilent = data.filter(function(row) {
            return row['generation'] === 'Silent';
    });
    var valueline2 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.suicides_no); });

    // define the 3rd line
    filteredDataGenX = data.filter(function(row) {
            return row['generation'] === 'Generation X';
    });
    var valueline3 = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.suicides_no); });
    
    // define the 4th line
    filteredDataMillenials = data.filter(function(row) {
                return row['generation'] === 'Millenials';
        });
        var valueline4 = d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.suicides_no); });
    
    // define the 5th line
    filteredDataGenGI = data.filter(function(row) {
                return row['generation'] === 'G.I. Generation';
        });
        var valueline5 = d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.suicides_no); });
    
    // define the 6th line
    filteredDataGenZ = data.filter(function(row) {
                return row['generation'] === 'Generation Z';
        });
        var valueline6 = d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.suicides_no); });


    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(visualElement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function(d) {
        d.year = +d.year;
        d.suicides_no = +d.suicides_no;
    });

    // Scale the range of the data
    var years = data.map(function(d) { return d.year });
    var int_years = years.map(Number);
    x.domain(d3.extent(int_years));
    
    var suicNum = data.map(function(d) { return d.suicides_no });
    var int_suic = suicNum.map(Number);
    y.domain([0, d3.max(int_suic)]);

    // Add the valueline path.
    svg.append("path")
        .data([filteredDataBoomers])
        .attr("class", "line")
        .style("stroke", "blue")
        .attr("d", valueline1);

    // Add the valueline2 path.
    svg.append("path")
        .data([filteredDataSilent])
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2);

    // Add the valueline3 path.
    svg.append("path")
        .data([filteredDataGenX])
        .attr("class", "line")
        .style("stroke", "yellow")
        .attr("d", valueline3);

    // Add the valueline4 path.
    svg.append("path")
        .data([filteredDataMillenials])
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", valueline4);

    // Add the valueline5 path.
    svg.append("path")
        .data([filteredDataGenGI])
        .attr("class", "line")
        .style("stroke", "black")
        .attr("d", valueline5);

    // Add the valueline6 path.
    svg.append("path")
        .data([filteredDataGenZ])
        .attr("class", "line")
        .style("stroke", "white")
        .attr("d", valueline6);

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
    var margin = {top: 5, right: 5, bottom: 5, left: 5},
        width = 400 - margin.left - margin.right,
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
            //.domain(["Alabama","Alaska","Arizona","Arkansas","California"])
            .domain([0, d3.max(dataset, function(d) { return d[0]; })])
            .range([padding, width-padding * 2]);

    var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d[1]; })])
            //.range([padding, width-padding * 2]);
            .range([height - padding, padding]);

    var xAxis = d3.axisBottom().scale(xScale).ticks(5);

    var yAxis = d3.axisLeft().scale(yScale).ticks(5);

    //create svg element
    var svg = d3.select(visualElement)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

    svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                    return xScale(d[0]);
            })
            .attr("cy", function(d) {
                    return height - yScale(d[1]);
            })
            .attr("r", 5)
            .attr("fill", "green");

    //x axis
    svg.append("g")
            .attr("class", "x axis")	
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);

    //y axis
    svg.append("g")
            .attr("class", "y axis")	
            .attr("transform", "translate(" + padding + ", 0)")
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


function drawAdditionalDiagram(visualElement, data) {

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