
function calculateRangeArray(numDiffValue, height){
    var rangeArray = [];
    for(i=0; i<=numDiffValue; i++){rangeArray.push(height*(i/(numDiffValue)));}
    rangeArray.push(height);
    return rangeArray;
}

function drawParallelCoordinatesChart(visualElement,data){

    var margin = {top: 50, right: 15, bottom: 35, left: 90},
        width = 1100 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var svg = d3.select(visualElement).append("svg")
        .attr("id", "svgParallel")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    //var rangeSex = calculateRangeArray(2, height);
    var rangeAge = calculateRangeArray(6, height);
    var rangeGeneration = calculateRangeArray(6, height);


    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    dimensions = [ "generation","suicide_100kpop", "age","hdi","gdp_per_capita","gni" ];

    /*d3.keys(data[0]).filter(function(d) {
        return d !== "year" && d !== "country" && d !== "gdp_per_capita" && d !== "country-year" 
                && d !== "gdp_per_year" && d !== "tot_suicides" && d !== "population"
                && d !== "X" && d !== "Y" && d !== "continent" && d !== "gni" 
                && d !== "gdp_per_capita" && d !== "life_expectancy"});*/

    // For each dimension, I build a ordinal scale. I store all in a y object
    var y = {};
    for (i in dimensions) {
        var name = dimensions[i];

        if (name === "gdp_per_capita"){
            y[name] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    return +d[name];
                }))
                .range([height, 0]);}
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
        if (name === "gni") {
            y[name] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    return +d[name];
                }))
                .range([height, 0]);}

        if (name === "generation"){
            range = rangeGeneration;
            y[name] = d3.scaleOrdinal()
                .range(range)
                .domain(data.map(function(d) {return d[name];}).sort());}

        if (name === "age"){
            range = rangeAge;
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
            if(d=="gni"){return "translate(" + x(d) + ")";}
            else{return "translate(" + x(d) + ")";} })
        // And I build the axis with the call function
        .each(function(d) {
            if (d === "age"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "gni"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "generation"){d3.select(this).call(d3.axisLeft().scale(y[d]));}
            if (d === "suicide_100kpop"){d3.select(this).call(d3.axisLeft().scale(y[d]))}
            if (d === "hdi"){d3.select(this).call(d3.axisLeft().scale(y[d]))}
            if (d === "gdp_per_capita"){d3.select(this).call(d3.axisLeft().scale(y[d]))}
        })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });
    
    svg.selectAll("text")
        .style("fill", "black");

    return document.getElementById("svgParallel");
}



function drawLinearChart(visualElement, data) {
    // set the dimensions and margins of the graph
    var margin = {top: 25, right: 15, bottom: 45, left: 85},
        width = 850 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    filteredDataBoomers = data.filter(function (row) {
        return row['generation'] === 'Boomers';
    });
    filteredDataSilent = data.filter(function (row) {
        return row['generation'] === 'Silent';
    });
    filteredDataGenX = data.filter(function (row) {
        return row['generation'] === 'Generation X';
    });
    filteredDataMillenials = data.filter(function (row) {
        return row['generation'] === 'Millenials';
    });
    filteredDataGenGI = data.filter(function (row) {
        return row['generation'] === 'G.I. Generation';
    });
    filteredDataGenZ = data.filter(function (row) {
        return row['generation'] === 'Generation Z';
    });

    var gen = [filteredDataGenGI, filteredDataSilent, filteredDataBoomers, filteredDataGenX,
        filteredDataMillenials, filteredDataGenZ];
    var legendKeys = ["G.I. Generation", "Silent", "Boomers", "Generation X", "Millenials", "Generation Z"];

    gen.forEach(function (generation, index) {
        var count = {};
        for (var i = 0; i < generation.length; i++) {
            var arr = generation[i];

            fractionalSuicides = parseFloat(arr["suicide_100kpop"]);
            population = parseInt(arr["population"]);
            totSuicidesPerRecord = Math.round(fractionalSuicides * population / 100000);

            if (arr['year'] in count) {
                count[arr['year']] = parseInt(count[arr['year']]) + totSuicidesPerRecord;
            } else {
                count[arr['year']] = totSuicidesPerRecord;
            }
        }
        generation = [];
        for (var key in count) {
            generation.push({year: key, tot_suicides: count[key]});
        }
        ;

        gen[index] = generation;
    });

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data
    var years = data.map(function (d) {
        return d.year
    });
    var int_years = years.map(Number);
    x.domain(d3.extent(int_years));

    var maxValue = 0;
    for (i = 0; i < gen.length; i++) {
        var suicNum = gen[i].map(function (d) {
            return d.tot_suicides
        });
        var int_suic = suicNum.map(Number);
        maxGen = d3.max(int_suic);
        if (maxGen > maxValue) {
            maxValue = maxGen;
        }
    }
    /*var suicNum = gen[0].map(function(d) { return d.tot_suicides });
    var int_suic = suicNum.map(Number);*/
    y.domain([0, maxValue]);

    var valueline = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.tot_suicides);
        });

    var color = ["#b2df8a", "#ffff99", "#e31a1c", "#6a3d9a", "#a6cee3", "#b15928"];

    if (document.getElementById("svgLinear") == null) {
        var svg = d3.select(visualElement).append("svg")
            .attr("id", "svgLinear")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var legend = d3.select(visualElement).append("svg")
            .attr("width", "125px")
            .attr("top", margin.top)
            .attr("left", width + margin.left + 55);

        gen.forEach(function (generation, index) {
            // Add the valueline path.
            var line = svg.append("path")
                .data([generation])
                .attr("class", "line")
                .style("stroke", function(){ return color[index]})
                .style("fill", "none")
                .style("stroke-width","2.5")
                .attr("d", valueline);

            legend.append('rect')
                .attr("width", "13px")
                .attr("height", "13px")
                .attr('y', function () {
                    return (index * 20);
                })
                .style("fill", function () {
                    return color[index]
                });

            legend.append('text')
                .attr("x", "20")
                .attr("font-size", " small")
                .attr('y', function () {
                    return (index * 20) + 12;
                })
                .text(legendKeys[index]);

            var totalLength = line.node().getTotalLength();

            line.attr("stroke-dasharray", totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration("3500")
                .attr("stroke-dashoffset", 0);

        });
        // Add the X Axis
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(-height).tickFormat(d3.format("d")))
            .attr("cx", years)
            .append("text").text("years").attr("x", width / 2)
            .attr("y", "30").style("font-size", "12px")
            .style("fill", "#000");


        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("cy", suicNum)
            .append("text").text("Tot suicides").attr("y", "-10")
            .style("font-size", "12px")
            .style("fill", "#000");
    }
    else{
        d3.select("#svgLinear").selectAll(".line")
            .data([generation]).enter()
            .append("path")
            .attr("class", "line")
            .transition().duration("1000")
            .attr("d", valueline);


    }

    return document.getElementById("svgLinear");
}


function drawScatterplot(visualElement, data){

    var margin = {top: 25, right: 15, bottom: 25, left: 85},
        width = 850 - margin.left - margin.right,
        height = 390 - margin.top - margin.bottom;
    padding = 50;

    var objDataContainer = [];
    var tot_suicides_parameter = 0;
    var oldCountry;
    if(data.length != 0){oldCountry = data[0].country}
    for(i=0; i<data.length; i++){
        fractionalSuicides = parseFloat(data[i].suicide_100kpop);
        population = parseInt(data[i].population);
        totSuicidesPerRecord = Math.round(fractionalSuicides*population/100000);

        currentCountry = data[i].country;
        if(currentCountry == oldCountry){
            tot_suicides_parameter = tot_suicides_parameter + totSuicidesPerRecord;
        } else {
            var objRecord = {};
            objRecord.X = data[i-1].X;
            objRecord.Y = data[i-1].Y;
            objRecord.country = oldCountry;
            objRecord.tot_suicides = tot_suicides_parameter;
            objRecord.hdi = data[i-1].hdi;
            objRecord.gdp_per_capita = data[i-1].gdp_per_capita;
            objDataContainer.push(objRecord);
            oldCountry = currentCountry;
            tot_suicides_parameter = 0;
            tot_suicides_parameter = tot_suicides_parameter + totSuicidesPerRecord;
        }
    }

    //scale function
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(objDataContainer, function(d) { return +(parseInt(d["gdp_per_capita"])); })])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(objDataContainer, function(d) {return +d["tot_suicides"]; })])
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

    var div = d3.select("#mainDiagram")
        .append("div").attr("class", "tooltip")
        .attr("id","scatterTooltip")
        .style("visibility","hidden");

    svg.selectAll("circle")
        .data(objDataContainer)
        .enter()
        .append("circle")
        .attr("class","secondCircle")
        .attr("cx", function(d) {
            return xScale(d["gdp_per_capita"]);
        })
        .attr("cy", function(d) {
            return yScale(d["tot_suicides"]);
        })
        .attr("r", 5)
        .attr("stroke", "#000")
        .attr("stroke-width","0.2px")
        .style("fill", function(d) {
            if(parseFloat(d["hdi"]) <= 0.60) {return 'red';}
            if(parseFloat(d["hdi"]) >= 0.75){return 'green'}
            else {return 'yellow';}
        })
        .on("mouseover", function(d) {
            var elem = d3.select(this)
            elem.transition()
                .duration('50')
                .attr('opacity', '1')
                .style("stroke","#fff")
                .style("stroke-width","1.5px")

            elem.moveToFront();

            div.transition()
                .duration(50)
                .style("visibility", "visible");

            div.html(d.country)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 15) + "px");

            d3.select("#dotG").selectAll(".dot")
                .each( function (p) {
                    if (p.country == d.country) {
                        d3.select(this).moveToFront()

                        d3.select("#mainDiagram").select("#mainTooltip")
                            .transition()
                            .duration('50')
                            .style("visibility", "visible");

                        d3.select("#mainDiagram").select("#mainTooltip")
                        .html("STATE:" + p.country + "<br>POP:" + p.population + "<br>SUICIDES:" +
                            (((p.tot_suicides) * 100000) / (p.population)).toFixed(2) +
                            "(per 100k)<br>GDP:" + p.gdp_per_year + "<br>HDI:" + p.hdi)
                            .style("left", (d3.select(this).attr("cx") + 5) + "px")
                            .style("top", (d3.select(this).attr("cy")  +5) + "px");
                    }
                })
                .style("stroke", function(p){
                        if (p.country == d.country) {
                            return "#fff";}
                })
                .style("stroke-width", function(p){
                        if (p.country == d.country) {
                            return "1.5px";}
                })


        })
        .on('mouseout', function (d, i) {
            var elem = d3.select(this)
            elem.transition()
                .duration('50')
                .attr('opacity', '1')
                .style("stroke","#000")
                .style("stroke-width","0.2px")


            elem.moveToBack();

            div.transition()
                .duration('50')
                .style("visibility", "hidden");

            d3.select("#mainDiagram").select(".tooltip")
                .transition()
                .duration('50')
                .style("visibility", "hidden");

            d3.select("#dotG").selectAll(".dot")
                .each( function (p) {
                    if (p.country == d.country) {
                        d3.select(this).moveToBack()
                    }
                })
                .style("stroke", function(p){
                    if (p.country == d.country) {
                        if (selectedCountries.includes(p.country)){
                            return "red"
                        }
                        else{ return "#000";}
                }})
                .style("stroke-width", function(p){
                    if (p.country == d.country) {
                        if (selectedCountries.includes(p.country)){
                            return ".9px"
                        }else{ return "0.2px";}
                }})
        });


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height+5) + ")")
        .call(xAxis)
        .append("text").text("Gdp per capita").attr("x",width/2)
        .attr("y","30").style("font-size", "10px")
        .style("fill", "#000");

    //y axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-5,0)")
        .call(yAxis)
        .append("text").text("Tot_suicides").attr("y","-10")
        .style("font-size", "10px")
        .style("fill", "#000");

    var legend = ["High hdi(0.75-1)","Medium hdi(0.61-074)","Low hdi(0-0.60)"];
    var legendColor =  ["red","yellow","green"];


    var legendSvg = d3.select(visualElement).append("svg")
        .attr("width", "165px")
        .attr("top", margin.top)
        .attr("left", width + margin.left + 55);

    legend.forEach(function(elem, index) {

        legendSvg.append('rect')
            .attr("width", "13px")
            .attr("height", "13px")
            .attr('y', function () {
                return (index * 30);
            })
            .style("fill", function () {
                return legendColor[index]
            });

        legendSvg.append('text')
            .attr("x", "20")
            .attr("font-size", " small")
            .attr('y', function () {
                return (index * 30) + 12;
            })
            .text(elem);
    })

    return document.getElementById("svgScatter");
}



function drawBarChart(visualElement, label, dataFull, maxValAge){

    var data = dataFull;

    var objDataContainer = [];

    var margin = {top: 5, right: 5, bottom: 5, left: 5},
        width = 150 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    var svg = d3.select(visualElement).append("svg")
        .attr("id", label)
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

    var gender;
    var totMale = 0;
    var totFemale = 0;
    for(i=0; i<data.length; i++){
        fractionalSuicides = parseFloat(data[i].suicide_100kpop);
        population = parseInt(data[i].population);
        totSuicidesPerRecord = Math.round(fractionalSuicides*population/100000);
        if(data[i].sex == "male"){
            gender = "male";
            totMale = totMale + totSuicidesPerRecord;
        }
        if(data[i].sex == "female"){
            gender = "female";
            totFemale = totFemale + totSuicidesPerRecord;
        }
    }
    var objDataM = {};
    objDataM.sex = "male";
    objDataM.tot_suicides = totMale;
    var objDataF = {};
    objDataF.sex = "female";
    objDataF.tot_suicides = totFemale;
    objDataContainer.push(objDataM);
    objDataContainer.push(objDataF);


    x.domain((objDataContainer.map(function (d) {
        return d.sex;
    })).sort());
    y.domain([0, maxValAge]);

    g.append("g")
        .attr("transform", "translate(50," + height + ")")
        .call(d3.axisBottom(x));

    var yAx = g.append("g")
        .attr("width","900px")
        .attr("transform", "translate(50,0)")
        .call(d3.axisLeft(y))

    yAx.append("text")
        .style("fill", "black")
        .attr("transform", "rotate(-90)")
        .attr("y", "20")
        .attr("x", "0")
        .attr("dy", "-.71em")
        .attr("text-anchor", "end")
        .text("tot_suicides");

    console.log(objDataContainer);
    if((objDataM.tot_suicides + objDataF.tot_suicides) != 0){

        var bar = g.selectAll(".bar")
            .data(objDataContainer)
            .enter().append("g")

        bar.append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {return x(d.sex)+50;})
            .attr("height","0")
            .attr("y", height)
            .attr("width", x.bandwidth())
            .style("fill", function (d){
                if (d.sex == "male"){
                    return "#246fb1";}
                else{
                    return "#b1249e";}
            })

        bar.selectAll("rect")
            //.transition().duration("400")
            .attr("height", function (d) {return height - y(Number(d.tot_suicides));})
            .attr("y", function (d) {return y(Number(d.tot_suicides));})

        bar.append("text")
            .attr("y", function(d) {
                return height;
            })
            .attr("x", function(d) {
                return x(d.sex)+60;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "8px")
            .attr("fill", "black")
            .text(function(d) {
                return d.tot_suicides;
            });

        bar.selectAll("text")
            //.transition().duration("400")
            .attr("y", function(d) {
                return y(Number(d.tot_suicides)+5);
            })
    }

    return document.getElementById(label);
}

function calculateMaxValueAge(data){
    var totMale = 0;
    var totFemale = 0;
    for(i=0; i<data.length; i++){
        fractionalSuicides = parseFloat(data[i].suicide_100kpop);
        population = parseInt(data[i].population);
        totSuicidesPerRecord = Math.round(fractionalSuicides*population/100000);
        if(data[i].sex == "male"){
            totMale = totMale + totSuicidesPerRecord;
        }
        if(data[i].sex == "female"){
            totFemale = totFemale + totSuicidesPerRecord;
        }
    }
    return Math.max(totMale, totFemale);
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
        .style("padding-top","80px");

    var filteredData05 = [];
    var filteredData15 = [];
    var filteredData25 = [];
    var filteredData35 = [];
    var filteredData55 = [];
    var filteredData75 = [];
    for(i=0; i<data.length; i++){
        if(data[i].age == "5-14 years"){filteredData05.push(data[i]);}
        if(data[i].age == "15-24 years"){filteredData15.push(data[i]);}
        if(data[i].age == "25-34 years"){filteredData25.push(data[i]);}
        if(data[i].age == "35-54 years"){filteredData35.push(data[i]);}
        if(data[i].age == "55-74 years"){filteredData55.push(data[i]);}
        if(data[i].age == "75+ years"){filteredData75.push(data[i]);}
    }

    var val05 = calculateMaxValueAge(filteredData05);
    var val15 = calculateMaxValueAge(filteredData15);
    var val25 = calculateMaxValueAge(filteredData25);
    var val35 = calculateMaxValueAge(filteredData35);
    var val55 = calculateMaxValueAge(filteredData55);
    var val75 = calculateMaxValueAge(filteredData75);
    var maxAge = Math.max(val05, val15, val25, val35, val55, val75);

    var svg1 = drawBarChart("#patternDiv", "5-14 years", filteredData05, maxAge);
    var svg2 = drawBarChart("#patternDiv", "15-24 years", filteredData15, maxAge);
    var svg3 = drawBarChart("#patternDiv", "25-34 years", filteredData25, maxAge);
    var svg4 = drawBarChart("#patternDiv", "35-54 years",filteredData35, maxAge);
    var svg5 = drawBarChart("#patternDiv", "55-74 years", filteredData55, maxAge);
    var svg6 = drawBarChart("#patternDiv", "75+ years", filteredData75, maxAge);

    var patternBars = [];
    patternBars.push(svg1);
    patternBars.push(svg2);
    patternBars.push(svg3);
    patternBars.push(svg4);
    patternBars.push(svg5);
    patternBars.push(svg6);
    return patternBars;
}

