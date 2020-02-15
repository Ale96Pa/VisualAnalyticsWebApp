/* 
 * This script collects the functions to manage all the elements in the filter
 * bar. In particular it contains the management of:
 * Brusher bar to select a range of values of HDI, GDP and Population;
 * World Map to select one or more countries.
 * Both elements are coordinated-views with the main diagram, but they are
 * independent each others.
 */

// Filter all records having "null" values
function filterOutNullRecords(data){
    var filteredData = [];
    for(i=0; i<data.length; i++){
        if(data[i].sex !== "null" && data[i].age !== "null" &&
            data[i].generation !== "null" && data[i].suicide_100kpop !== "null"
            && data[i].gdp_per_capita !== "null"){
            filteredData.push(data[i]);
        }
    }
    return filteredData;
}

// This function draws and manage all the filters
function filters(visualElement, data) {
    var colors = {Europe:"#377eb8",Antartide:"#e41a1c",Asia:"#4daf4a",Americas:"#984ea3",Oceania:"#ff7f00",Africa:"#ffff33"};

// This function generate a new brusher bar (used for brushers HDI, GDP and population)
    function newFilterBar(data, name) {

        var header = d3.keys(data[0]);
        var index = header.indexOf(name);
        var width = 550,
            height = 95;
    
        var x = d3.scaleLinear()
            .range([0, width-150])
            .domain([0, d3.max(data, function (d) {return +d[name];})]);

        var xAxis = d3.axisBottom(x);

        var brush = d3.brushX()
            .extent([[0, 0], [width-150, 20]]);

        if (name === 'gdp_per_year'){
            name="gdp";
            brush.on("brush", brushedGDP);}
        else if (name === 'hdi'){
            brush.on("brush", brushedHdi);}
        else if (name === 'population'){
            brush.on("brush", brushedPop);}

        // svg for bars
        var svg = d3.select(visualElement)
            .append("svg")
            .attr("class","filterBrush")
            .attr("width", width)
            .attr("height", height);
        svg.append("text")
            .attr("transform", "translate(30,30)")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text(name + ":");

        // Context for brushing
        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(90,15)");
        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0,17)")
            .style("fill", "white")
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

// Functions for the management of brushing
        function brushedPop() {
            var selection = d3.event.selection;
            rangeBrushes[0] = selection.map(x.invert, x);
            var filteredData = filterAllDataBrusher(data, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1]);
            d3.select("#dotG").selectAll(".dot")
                .style("fill", function(d){
                    if (filteredData[0].includes(d["country"])){return colors[d["continent"]];}
                    else{return "gray";}
                });
            changeOnSecondary(filteredData[1]);
        };
        function brushedHdi() {
            var selection = d3.event.selection;
            rangeBrushes[2] = selection.map(x.invert, x);
            var filteredData = filterAllDataBrusher(data, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1]);
            d3.select("#dotG").selectAll(".dot")
                .style("fill", function (d) {
                    if (filteredData[0].includes(d["country"])){return colors[d["continent"]];}
                    else{return "gray";}
                });
            changeOnSecondary(filteredData[1]);
        };
        function brushedGDP() {
            var selection = d3.event.selection;
            rangeBrushes[1] = selection.map(x.invert, x);
            var filteredData = filterAllDataBrusher(data, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1]);
            d3.select("#dotG").selectAll(".dot")
                .style("fill", function(d){
                    if (filteredData[0].includes(d["country"])){return colors[d["continent"]];}
                    else{return "gray";}
                });
            changeOnSecondary(filteredData[1]);
        };
    }

    // Generation of the brusher bars
    newFilterBar(data, "population");
    newFilterBar(data, "gdp_per_year");
    newFilterBar(data, "hdi");
}

// Management of the change of statistical diagrams based on filter bar parameters
function changeOnSecondary(tmpData){
    var svgFromBrush=null;
    var filteredData = filterAllDataCheckbox(tmpData, male, female, age5_14, age15_24, age25_34,
        age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
        genMillenials, genZ);
        
    // Parallel coordinates management
    if(document.getElementById("svgParallel") !== null) {
        var dataNoNull = filterOutNullRecords(filteredData);
        d3.select("#secondDiagram").selectAll("svg").remove();
        svgFromBrush = drawParallelCoordinatesChart("#secondDiagram",dataNoNull);

        if (selectedCountries.length !== 0 || (selectionData !== null && selectionData.length === 2)) {
            d3.select("#svgParallel").selectAll(".innerPath").transition()
                .style("opacity", function (d) {
                    if (selectedCountries.includes(d.country)){return "1";}
                    if ((selectionData !== null && selectionData.length === 2)
                        && ((d["X"]) > selectionData[0][0]) && ((d["X"]) < selectionData[1][0]) &&
                        ((d["Y"]) < selectionData[0][1]) && ((d["Y"]) > selectionData[1][1])) {
                            return "1";
                    }else {return "0.3";}
                })
                .style("stroke", function (d) {
                    if (selectedCountries.includes(d.country)){return "#1f78b4";}
                    if ((selectionData !== null && selectionData.length === 2)
                        && ((d["X"]) > selectionData[0][0]) && ((d["X"]) < selectionData[1][0]) &&
                        ((d["Y"]) < selectionData[0][1]) && ((d["Y"]) > selectionData[1][1])) {
                            return "#1f78b4";
                    }else {return "#2ca25f";}
                });
        }
    }

    // Scatter plot management
    if(document.getElementById("svgScatter") !== null) {
        var dataNoNull = filterOutNullRecords(filteredData);
        d3.select("#secondDiagram").selectAll("svg").remove();
        svgFromBrush = drawScatterplot("#secondDiagram",dataNoNull);
        
        if (selectedCountries.length !== 0 || (selectionData !== null && selectionData.length === 2)) {
            d3.select("#svgScatter").selectAll("circle")
                .style("opacity", function (d) {
                    console.log(d)
                    if (selectedCountries.includes(d.country)){return "1";}
                    if ((selectionData !== null && selectionData.length === 2)
                        && ((d["X"]) > selectionData[0][0]) && ((d["X"]) < selectionData[1][0]) &&
                        ((d["Y"]) < selectionData[0][1]) && ((d["Y"]) > selectionData[1][1])) {
                            return "1";
                    } else {return "0.1";}});
        }
    }

    // Pattern of barcharts management
    if(document.getElementById("patternDiv") !== null) {
        var dataNoNull = filterOutNullRecords(filteredData);
        var dataNoNull1 = filterCountry(dataNoNull, selectedCountries);
        d3.select("#secondDiagram").selectAll("div").remove();
        d3.select("#secondDiagram").selectAll("svg").remove();
        svgFromBrush = drawPatternBarchart("#secondDiagram",dataNoNull1);
    }

    // Management of save on provenance button
    document.getElementById("saveOnProvenance").onclick=function(){
        saveSvgFile("provenanceBar", svgFromBrush, svgs_to_save);
    };
}

/**
 * The following functions are simple filtering of data from the shared dataset
 * depending on all the possible filters in the filter bar.
 */
function filterRangeHdi(data, min, max){
    var filteredData = [];
    var dlen = data.length;
    for(i=0; i<dlen; i++){
        hdiValue = parseFloat(data[i].hdi);
        if(hdiValue >= min && hdiValue <= max){filteredData.push(data[i]);}
    }
    return filteredData;
}

function filterRangePopulation(data, min, max){
    var filteredData = [];
    var dlen = data.length;
    for(i=0; i<dlen; i++){
        hdiValue = parseFloat(data[i].population);
        if(hdiValue >= min && hdiValue <= max){filteredData.push(data[i]);}
    }
    return filteredData;
}

function filterRangeGdp(data, min, max){
    var filteredData = [];
    var dlen = data.length;
    for(i=0; i<dlen; i++){
        hdiValue = parseFloat(data[i].gdp_per_year);
        if(hdiValue >= min && hdiValue <= max){filteredData.push(data[i]);}
    }
    return filteredData;
}

function filterSelection(data, selection){
    var filteredData = [];
    if(selection !== null && selection.length === 2) {
        var dlen = data.length;
        for (i = 0; i < dlen; i++) {
            if (((data[i]["X"]) > selection[0][0]) && ((data[i]["X"]) < selection[1][0]) &&
                ((data[i]["Y"]) < selection[0][1]) && ((data[i]["Y"]) > selection[1][1])) {
                filteredData.push(data[i]);
            }
        }
    }else{ filteredData = data; }
    return filteredData;
}

function filterCountry(data,countries){
    var filteredData = [];
    if(countries.length !== 0) {
        var dlen = data.length;
        for (i = 0; i < dlen; i++) {
            if (countries.includes(data[i].country)) {filteredData.push(data[i]);}
        }
    }else {filteredData = data;}
    return filteredData;
}

function filterAllDataBrusher(data, hdiRange, popRange, gdpRange){
    var filter = filterRangePopulation(data, popRange[0], popRange[1]);
    var filteredCountry=[];
    if (gdpRange.length !== 0){
        filter = filterRangeGdp(filter, gdpRange[0], gdpRange[1]);}
    if (hdiRange.length !== 0){
        filter = filterRangeHdi(filter, hdiRange[0], hdiRange[1]);}

    var dlen = filter.length;
    for(i=0; i<dlen; i++){
        filteredCountry.push(filter[i].country);
    }
    return [filteredCountry, filter];
}

function filterSex(data, male, female){
    var filteredData = [];
    var dlen = data.length;
    for(i=0; i<dlen; i++){
        if(male){if(data[i].sex === 'male'){filteredData.push(data[i]);}}
        if(female){if(data[i].sex === 'female'){filteredData.push(data[i]);}}
    }
    return filteredData;
}

function filterAge(data, age5_14, age15_24, age25_34, age35_54, age55_74, age75){
    var filteredData = [];
    var dlen = data.length;
    for(i=0; i<dlen; i++){
        if(age5_14){if(data[i].age === '5-14 years'){filteredData.push(data[i]);}}
        if(age15_24){if(data[i].age === '15-24 years'){filteredData.push(data[i]);}}
        if(age25_34){if(data[i].age === '25-34 years'){filteredData.push(data[i]);}}
        if(age35_54){if(data[i].age === '35-54 years'){filteredData.push(data[i]);}}
        if(age55_74){if(data[i].age === '55-74 years'){filteredData.push(data[i]);}}
        if(age75){if(data[i].age === '75+ years'){filteredData.push(data[i]);}}
    }
    return filteredData;
}

function filterGeneration(data, genGi, genSilent, genBoomers, genX, genMillenials, genZ){
    var filteredData = [];
    var dlen = data.length;
    for(i=0; i<dlen; i++){
        if(genGi){if(data[i].generation === 'G.I. Generation'){filteredData.push(data[i]);}}
        if(genSilent){if(data[i].generation === 'Silent'){filteredData.push(data[i]);}}
        if(genBoomers){if(data[i].generation === 'Boomers'){filteredData.push(data[i]);}}
        if(genX){if(data[i].generation === 'Generation X'){filteredData.push(data[i]);}}
        if(genMillenials){if(data[i].generation === 'Millenials'){filteredData.push(data[i]);}}
        if(genZ){if(data[i].generation === 'Generation Z'){filteredData.push(data[i]);}}
    }
    return filteredData;
}

function filterAllDataCheckbox(data, male, female, age5_14, age15_24, age25_34,
        age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX, 
        genMillenials, genZ){
        var filter1 = filterSex(data, male, female);
        var filter2 = filterAge(filter1, age5_14, age15_24, age25_34, age35_54, age55_74, age75);
        var filter3 = filterGeneration(filter2, genGi, genSilent, genBoomers, genX, genMillenials, genZ);
        return filter3;
}

//This function manages and draw the map in the filter bar
function worldMap(visualElement) {

    // Initialization
    var margin = {top: 0, right: 10, bottom: 0, left: 20};
    var width = 550 ;
    var height = width / 2.2;
    var projection,path,svg,g;
    var colors = {Europe:"#377eb8",Antartide:"#e41a1c",Asia:"#4daf4a",Americas:"#984ea3",Oceania:"#ff7f00",Africa:"#ffff33"};

    var zoom = d3.zoom()
        .scaleExtent([1, 9])
        .on("zoom", move);

    projection = d3.geoMercator()
        .translate([(width/2), (height/2)])
        .scale( width/2/ Math.PI);

    path = d3.geoPath().projection(projection);

    svg = d3.select("#"+visualElement)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate( 20 , 10)")
        .style( "border-radius", "10%")
        .call(zoom)
        .append("g");
    svg.append("rect")
        .attr("x", 0).attr("y", 0)
        .attr("height", height).attr("width", width)
        .style("stroke", "white")
        .style("fill", "none")
        .style( "stroke-radius", "10%")
        .style("stroke-width", "3");

    var div = d3.select("#"+visualElement)
        .append("div").attr("class", "tooltip")
        .style("visibility","hidden");

    g = svg.append("g");

    d3.json("dataset/world.json")
        .then(function (world) {
            var countries = topojson.feature(world, world.objects.countries).features;
            topo = countries;
            draw(topo);
        });
        
    // Draw the map basing on data in the file dataset/world.json
    function draw(topo) {
        var data = dataFull;
        var country = g.selectAll(".country").data(topo);
        var states = data.map(function(p){return p.country;});
        var blankMap = country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("title", function(d,i) { return d.properties.name; })
            .style("fill","gray")
            .style("stroke-width","1.5")
            .on("mouseover", function(d,i) {
                d3.select(this)
                    .transition()
                    .duration('50')
                    .attr('opacity', '1');
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
            .on("click",function(m) {
                if(selectedCountries.includes(m.properties.name)){
                    d3.select(this).style("stroke","none").style("stroke-width", "none");
                    //if condition needed because this statement remove last element when index not found
                    selectedCountries.splice( selectedCountries.indexOf(m.properties.name), 1 );
                }else{
                    d3.select(this).style("stroke","red").style("stroke-width", ".9px");
                    selectedCountries.push(m.properties.name);}

// Coordination MAIN DIAGRAM
                d3.select("#dotG").selectAll(".dot")
                    .style("opacity", function(d){
                        if (selectedCountries.includes(d.country)){return "1";}
                        else{return "0.1";}
                    })
                    .style("stroke", function(d){
                    if (selectedCountries.includes(d.country)) {return "red";}
                    })
                    .style("stroke-width",function(d){
                        if (selectedCountries.includes(d.country)) {return ".9px";}
                    })
                    .each(function(d) {
                        if (selectedCountries.includes(d.country)) {
                            d3.select(this).moveToFront();
                        }
                    });

// Coordination STATISTICAL DIAGRAMS
                var tmpDataMap = null, svgFromMap=null;

                if (selectedCountries.length !== 0 ||( selectionData !== null && selectionData.length === 2)){
    // Coordination LINEAR CHART
                    if(document.getElementById("svgLinear") !== null){
                        var dataNoNull = filterOutNullRecords(dataFull);
                        var dataNoNull1 = filterCountry(dataNoNull, selectedCountries);
                        var filteredDataMap = filterAllDataCheckbox(dataNoNull1, male, female, age5_14, age15_24, age25_34,
                            age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
                            genMillenials, genZ);

                        d3.select("#secondDiagram").selectAll("svg").remove();
                        svgFromMap = drawLinearChart("#secondDiagram",filteredDataMap);
                    }
                    
    // Coordination PARALLEL COORDINATES 
                    if (document.getElementById("svgParallel") !== null) {
                        d3.select("#svgParallel").selectAll(".innerPath").transition()
                            .style("opacity", function (d) {
                                if (selectedCountries.includes(d.country)) {return "1";}
                                if ((selectionData !== null && selectionData.length === 2)
                                    && ((d["X"]) > selectionData[0][0]) && ((d["X"]) < selectionData[1][0]) &&
                                    ((d["Y"]) < selectionData[0][1]) && ((d["Y"]) > selectionData[1][1])) {
                                    return "1";
                                }
                                else {return "0.3";}
                            })
                            .style("stroke", function (d) {
                                if (selectedCountries.includes(d.country)) {return "#1f78b4";}
                                if ((selectionData !== null && selectionData.length === 2)
                                    && ((d["X"]) > selectionData[0][0]) && ((d["X"]) < selectionData[1][0]) &&
                                    ((d["Y"]) < selectionData[0][1]) && ((d["Y"]) > selectionData[1][1])) {
                                    return "#1f78b4";
                                }
                                else {return "#2ca25f";}
                            });
                    }
                    
    // Coordination SCATTER PLOT
                    if (document.getElementById("svgScatter") !== null) {
                        d3.select("#svgScatter").selectAll("circle")
                            .transition().duration("450")
                            .style("opacity", function (d) {
                                if (selectedCountries.includes(d.country)) {return "1";}
                                if ((selectionData !== null && selectionData.length === 2)
                                    && ((d["X"]) > selectionData[0][0]) && ((d["X"]) < selectionData[1][0]) &&
                                    ((d["Y"]) < selectionData[0][1]) && ((d["Y"]) > selectionData[1][1])) {
                                    return "1";
                                }
                                else {return "0.1";}
                            });
                    }
                    
    // Coordination PATTERN OF BARCHARTS
                    if (document.getElementById("patternDiv") !== null) {
                        var dataYearNoNull = filterOutNullRecords(dataYear);
                        var dataYearNoNull1 = filterCountry(dataYearNoNull, selectedCountries);
                        var tmpDataMap2 = filterAllDataBrusher(dataYearNoNull1, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1]);
                        filteredDataMap = filterAllDataCheckbox(tmpDataMap2[1], male, female, age5_14, age15_24, age25_34,
                            age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
                            genMillenials, genZ);
                            
                        d3.select("#secondDiagram").selectAll("div").remove();
                        d3.select("#secondDiagram").selectAll("svg").remove();
                        svgFromMap = drawPatternBarchart("#secondDiagram",filteredDataMap);
                    }
                    document.getElementById("saveOnProvenance").onclick=function(){
                        saveSvgFile("provenanceBar", svgFromMap, svgs_to_save);}

                }
// Case of NO SELECTION in map
                else {
                    if (document.getElementById("svgParallel") !== null) {
                        d3.select("#svgParallel").selectAll(".innerPath")
                            .style("stroke", "#2ca25f");
                        d3.select("#svgParallel").selectAll(".innerPath").transition()
                            .style("opacity", "1");
                    }
                    if (document.getElementById("svgScatter") !== null) {
                        d3.select("#svgScatter").selectAll("circle")
                            .transition().duration("450")
                            .style("opacity", "1");
                    }
                    if (document.getElementById("svgLinear") !== null) {
                        var dataNoNull = filterOutNullRecords(dataFull);
                        filteredData = filterAllDataCheckbox(dataNoNull, male, female, age5_14, age15_24, age25_34,
                            age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
                            genMillenials, genZ);

                        d3.select("#secondDiagram").selectAll("svg").remove();
                        svgFromMap = drawLinearChart("#secondDiagram",filteredData);

                    }
                    if (document.getElementById("patternDiv") !== null) {
                        var dataYearNoNull = filterOutNullRecords(dataYear);
                        tmpData = filterAllDataBrusher(dataYearNoNull, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1]);
                        filteredData = filterAllDataCheckbox(tmpData[1], male, female, age5_14, age15_24, age25_34,
                            age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
                            genMillenials, genZ);
                            
                        d3.select("#secondDiagram").selectAll("svg").remove();
                        svgFromMap = drawPatternBarchart("#secondDiagram",filteredData);
                    }
                    document.getElementById("saveOnProvenance").onclick=function(){
                            saveSvgFile("provenanceBar", svgFromMap, svgs_to_save);};
                }
            });

        // Color gray for countries not in dataset
        blankMap.style("fill", function(d, i) {
            if (states.includes(d.properties.name)){
                var dlen = data.length;
                for(i=0; i<dlen; i++){
                   if(data[i].country === d.properties.name){return colors[data[i].continent];}
               }
            }
            else { return "gray";}
        });
    }

    // Management of movements in map: drag vertically and horizonatlly
    function move() {
        //var t = d3.event.translate;
        //var s = d3.event.scale;
        var t = [d3.event.transform.x,d3.event.transform.y];
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