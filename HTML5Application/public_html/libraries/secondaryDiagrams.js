function filterOutNullRecords(data){
    var filteredData = [];
    for(i=0; i<data.length; i++){
        if(data[i].sex != "null" && data[i].age != "null" && 
                data[i].generation != "null" && data[i].suicide_100kpop != "null"
                && data[i].gdp_per_capita != "null"){
        filteredData.push(data[i]);
        }
    }
    return filteredData;
}
function calculateRangeArray(numDiffValue, height){
    var rangeArray = [];
    for(i=0; i<=numDiffValue; i++){rangeArray.push(height*(i/(numDiffValue)));}
    rangeArray.push(height);
    return rangeArray;
}
function drawParallelCoordinatesChart(visualElement,dataFull){
    
    // dataFull is all data with null values, so i filter them obtaining data
    data = filterOutNullRecords(dataFull);
    
    //TODO: center better
    var margin = {top: 50, right: 10, bottom: 50, left: 20},
    width = 1200 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

    var rangeSex = calculateRangeArray(2, height);
    var rangeAge = calculateRangeArray(6, height);
    var rangeGeneration = calculateRangeArray(6, height);
    var rangeSuic = calculateRangeArray(9, height);;
    var rangeHdi = calculateRangeArray(9, height);;
    
    // append the svg object to the body of the page
    var svg = d3.select(visualElement)
        .append("svg")
        .attr("id", "svgGraph")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    dimensions = d3.keys(data[0]).filter(function(d) { 
        return d !== "year" && d !== "country" && d !== "gdp_per_capita" && d !== "country-year" 
                && d !== "gdp_per_year" && d !== "tot_suicides" && d !== "population"
                && d !== "X" && d !== "Y" && d !== "continent" && d !== "gni" 
                && d !== "gdp_per_capita" && d !== "life_expectancy"});

    // For each dimension, I build a ordinal scale. I store all in a y object
    var y = {};
    for (i in dimensions) {
        name = dimensions[i];
        if (name === "age"){range = rangeAge;}
        if (name === "sex"){range = rangeSex;}
        if (name === "generation"){range = rangeGeneration;}
        if (name === "suicide_100kpop"){range = rangeSuic;}
        if (name === "hdi"){range = rangeHdi;}

        y[name] = d3.scaleOrdinal()
            .range(range)
            .domain(data.map(function(d) {return d[name];}).sort());
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function(p) {return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines
    svg.selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", "#69b3a2")
        .style("opacity", 0.5);

    //TODO: capire come settare bene questi due array in base ai valori di hdi e suic/100k in input
    var tickHdi = ['0 - 0.11','0.12 - 0.21','0.22 - 0.31','0.32 - 0.41', '0.42 - 0.51',
        '0.52 - 0.61','0.62 - 0.71','0.72 - 0.81','0.82 - 0.91', '0.92 - 1', '1'];
    var tickSuic = ['0 - 20','20.1 - 40','40.1 - 60','60.1 - 80', '80.1 - 100',
        '100.1 - 120','120.1 - 140','140.1 - 160','160.1 - 180', '180.1 - 200', '200+'];
    // Draw the axis:
    svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) {
            if (d === "age"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "sex"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "generation"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "suicide_100kpop"){d3.select(this).call(d3.axisLeft()
                                            .scale(y[d])
                                            //.ticks(10)
                                            .tickFormat(function(d,i){
                                                return tickSuic[i]}));}
            if (d === "hdi"){d3.select(this).call(d3.axisLeft()
                                            .scale(y[d])
                                            //.ticks(10)
                                            .tickFormat(function(d,i){
                                                return tickHdi[i]}));}
        })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });
    
    svg.selectAll("text")
        .style("fill", "white");
}

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
        "G,I. Generation", "Generation Z"];

    gen.forEach(function(generation, index){
        var count = {};
        for (var i = 0; i < generation.length; i++) {
            var arr = generation[i];
            
            fractionalSuicides = parseFloat(arr["suicide_100kpop"]);
            population = parseInt(arr["population"]);
            totSuicidesPerRecord = Math.round(fractionalSuicides*population/100000);
            
            if (arr['year'] in count) {
                count[arr['year']] = parseInt(count[arr['year']]) + totSuicidesPerRecord;
            } else {
                count[arr['year']] = totSuicidesPerRecord;
            }
        }
        generation = [];
        for (var key in count) {
            generation.push({year: key, tot_suicides: count[key]});
        };

        gen[index] = generation;
    });
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data
    var years = gen[0].map(function(d) { return d.year });
    var int_years = years.map(Number);
    x.domain(d3.extent(int_years));
    
    var maxValue = 0;
    for(i=0; i<gen.length; i++){
        var suicNum = gen[i].map(function(d) { return d.tot_suicides });
        var int_suic = suicNum.map(Number);
        maxGen = d3.max(int_suic);
        if (maxGen > maxValue){maxValue = maxGen;}
    }
    /*var suicNum = gen[0].map(function(d) { return d.tot_suicides });
    var int_suic = suicNum.map(Number);*/
    y.domain([0, maxValue]);

    var valueline = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.tot_suicides); });

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
    var numSuic = data.map(function(d) { return d.tot_suicides });
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
            .domain([0, d3.max(data, function(d) { return +d["tot_suicides"]; })])
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
            .style("fill", "darkgreen");


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
         
    var males = [];
    var females = [];
    var tot_suic = [];
    var containerData = [];
    var correctData = {};
    for(i=0; i<data.length; i++){
        fractionalSuicides = parseFloat(data[i].suicide_100kpop);
        population = parseInt(data[i].population);
        totSuicidesPerRecord = Math.round(fractionalSuicides*population/100000);
        if(data[i].sex == "male"){
            males.push(totSuicidesPerRecord);
            correctData["sex"] = "male";
            correctData["tot_suicides"] = totSuicidesPerRecord;
            containerData.push(correctData);
        }
        if(data[i].sex == "female"){
            females.push(totSuicidesPerRecord);
            correctData["sex"] = "female";
            correctData["tot_suicides"] = totSuicidesPerRecord;
            containerData.push(correctData);
        }
        tot_suic.push(totSuicidesPerRecord);
    }
   
    x.domain(data.map(function (d) {return d.sex;}));
    y.domain([0, d3.max(tot_suic)]);
    
    console.log(containerData)
                    
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
    g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .style("fill", "white")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("tot_suicides");

    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
            return x(d.sex);
    })
    .attr("y", function (d) {
            return y(Number(d.tot_suicides));
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
            return height - y(Number(d.tot_suicides));
    });
}

function drawPatternBarchart(visualElement, dataFull){
    
    // dataFull is all data with null values, so i filter them obtaining data
    data = filterOutNullRecords(dataFull);
    
    var filteredData35 = [];
    var filteredData15 = [];
    var filteredData55 = [];
    var filteredData05 = [];
    var filteredData25 = [];
    var filteredData75 = [];
    for(i=0; i<data.length; i++){
        if(data[i].age == "35-54 years"){filteredData35.push(data[i]);}
        if(data[i].age == "15-24 years"){filteredData15.push(data[i]);}
        if(data[i].age == "55-74 years"){filteredData55.push(data[i]);}
        if(data[i].age == "5-14 years"){filteredData05.push(data[i]);}
        if(data[i].age == "25-34 years"){filteredData25.push(data[i]);}
        if(data[i].age == "75+ years"){filteredData75.push(data[i]);}
    }

    drawBarChart(visualElement, filteredData35);
    drawBarChart(visualElement, filteredData15);
    drawBarChart(visualElement, filteredData55);
    drawBarChart(visualElement, filteredData05);
    drawBarChart(visualElement, filteredData25);
    drawBarChart(visualElement, filteredData75);
}