

function calculateRangeArray(numDiffValue, height){
    var rangeArray = [];
    for(i=0; i<=numDiffValue; i++){rangeArray.push(height*(i/(numDiffValue)));}
    rangeArray.push(height);
    return rangeArray;
}

function drawParallelCoordinatesChart(visualElement,data){

    var margin = {top: 30, right: 15, bottom: 35, left: 45},
        width = 1150 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select(visualElement).append("svg")
        .attr("id", "svgParallel")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var rangeSex = calculateRangeArray(2, height);
    var rangeAge = calculateRangeArray(6, height);
    var rangeGeneration = calculateRangeArray(6, height);


    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    dimensions = d3.keys(data[0]).filter(function(d) { 
        return d !== "year" && d !== "country" && d !== "gdp_per_capita" && d !== "country-year" 
                && d !== "gdp_per_year" && d !== "tot_suicides" && d !== "population"
                && d !== "X" && d !== "Y" && d !== "continent" && d !== "gni" 
                && d !== "gdp_per_capita" && d !== "life_expectancy"});

    // For each dimension, I build a ordinal scale. I store all in a y object
    var y = {};
    for (i in dimensions) {
        var name = dimensions[i];

        if (name === "hdi"){
            y[name] = d3.scaleLinear()
            .domain(d3.extent(data, function (d) {
                return +d[name];
            }))
            .range([height, 0]);}
        if (name === "suicide_100kpop") {
            y[name] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    return +d[name];
                }))
                .range([height, 0]);}

        if (name === "generation"){
            range = rangeGeneration
            y[name] = d3.scaleOrdinal()
                .range(range)
                .domain(data.map(function(d) {return d[name];}).sort());}
        if (name === "sex"){
            range = rangeSex
            y[name] = d3.scaleOrdinal()
                .range(range)
                .domain(data.map(function(d) {return d[name];}).sort());}
        if (name === "age"){
            range = rangeAge
            y[name] = d3.scaleOrdinal()
                .range(range)
                .domain(data.map(function(d) {return d[name];}).sort());}

    }

    // Build the X scale -> it find the best position for each - 0.21',Y axis
     x = d3.scaleBand().rangeRound([0, width-125]).padding(.1).domain(dimensions);

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function(p) {return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines
    svg.selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("class","innerPath")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", "#2ca25f")
        .style("opacity", 0.5);


    svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) {
            return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) {
            if (d === "age"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "sex"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "generation"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "suicide_100kpop"){d3.select(this).call(d3.axisLeft()
                                            .scale(y[d]))}

            if (d === "hdi"){d3.select(this).call(d3.axisLeft()
                                            .scale(y[d]))}

        })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });
    
    svg.selectAll("text")
        .style("fill", "white");

    var svgData = document.getElementById("svgParallel");
    return svgData;
}



function drawLinearChart(visualElement, data){
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
    var years = data.map(function(d) { return d.year });
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
        .attr("id", "svgLinear")
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
    });
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("cx", suicNum);

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .attr("cy", years);

    var svgData = document.getElementById("svgLinear");
    return svgData;
}


//TODO: clusterization depending on hdi
function drawScatterplot(visualElement, data){
    var margin = {top: 95, right: 15, bottom: 35, left: 85},
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

    //create svg element
    var svg = d3.select(visualElement).append("svg")
        .attr("id", "svgScatter")
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

    var svgData = document.getElementById("scatterSecondary");
    return svgData;
}

function drawBarChart(visualElement, label, dataFull){

    var data = dataFull;

    var margin = {top: 5, right: 5, bottom: 5, left: 5},
        width = 150 - margin.left - margin.right,
        height = 230 - margin.top - margin.bottom;
    
    var svg = d3.select(visualElement).append("svg")
        .attr("id", "svgBarchart")
        .attr("height","330px");
    svg.append("text").text(label)
        .attr("transform", "translate("+width/2+",10)");
    g = svg.append("g")
        .attr("transform", "translate(" + margin.left + ",30)");

    var x = d3.scaleBand()
            .rangeRound([0, 120])
            .padding(0.1);

    var y = d3.scaleLinear()
            .rangeRound([height, 0]);

    for(i=0; i<data.length; i++){
        fractionalSuicides = parseFloat(data[i].suicide_100kpop);
        population = parseInt(data[i].population);
        totSuicidesPerRecord = Math.round(fractionalSuicides*population/100000);
        data[i].tot_suicides = totSuicidesPerRecord;
    }


    x.domain((data.map(function (d) {
                    return d.sex;
            })).sort());

    y.domain([0, 150000]);

    g.append("g")
    .attr("transform", "translate(50," + height + ")")
    .call(d3.axisBottom(x));
    
    var yAx = g.append("g").attr("transform", "translate(50,0)")
    .call(d3.axisLeft(y))

        yAx.append("text")
    .style("fill", "white")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-.71em")
    .attr("text-anchor", "end")
    .text("tot_suicides");

    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {return x(d.sex)+50;})
    .attr("y", function (d) {return y(Number(d.tot_suicides));})
    .attr("width", x.bandwidth())
    .attr("height", function (d) {return height - y(Number(d.tot_suicides));})
        .style("fill", function (d){
            if (d.sex == "male"){
                return "#246fb1";}
            else{
                return "#b1249e";}
        });

    var svgData = document.getElementById("svgBarchart");
    return svgData;
}

function drawPatternBarchart(visualElement, data){

    var margin = {top: 25, right: 25, bottom: 25, left: 5},
        width = 1050 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var div = d3.select(visualElement)
        .append("div").attr("id", "patternDiv")
        .attr("width",width)
        .attr("height",height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("display","inline-flex")
        .style("padding-top","80px")
        .style("position","relative");

    var filteredData35 = [];
    var filteredData15 = [];
    var filteredData55 = [];
    var filteredData05 = [];
    var filteredData25 = [];
    var filteredData75 = [];
    for(i=0; i<data.length; i++){
        if(data[i].age == "5-14 years"){filteredData05.push(data[i]);}
        if(data[i].age == "15-24 years"){filteredData15.push(data[i]);}
        if(data[i].age == "25-34 years"){filteredData25.push(data[i]);}
        if(data[i].age == "35-54 years"){filteredData35.push(data[i]);}
        if(data[i].age == "55-74 years"){filteredData55.push(data[i]);}
        if(data[i].age == "75+ years"){filteredData75.push(data[i]);}
    }
    var svg1 = drawBarChart("#patternDiv", "5-14 years", filteredData05);
    var svg2 = drawBarChart("#patternDiv", "15-24 years", filteredData15);
    var svg3 = drawBarChart("#patternDiv", "25-34 years", filteredData25);
    var svg4 = drawBarChart("#patternDiv", "35-54 years",filteredData35);
    var svg5 = drawBarChart("#patternDiv", "55-74 years", filteredData55);
    var svg6 = drawBarChart("#patternDiv", "75+ years", filteredData75);

    var patternBars = [];
    patternBars.push(svg1);
    patternBars.push(svg2);
    patternBars.push(svg3);
    patternBars.push(svg4);
    patternBars.push(svg5);
    patternBars.push(svg6);
    return patternBars;
}