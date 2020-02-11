/* 
 * This script collects the functions to manage all the elements in the filter
 * bar. In particular it contains the management of:
 * Brusher bar to select a range of values of HDI, GDP and Population;
 * World Map to select one or more countries.
 * Both elements are coordinated-views with the main diagram, but they are
 * independent each others.
 */
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

function filters(visualElement, data) {

    var colors = {Europe:"#e41a1c",Antartide:"#377eb8",Asia:"#4daf4a",Americas:"#984ea3",Oceania:"#ff7f00",Africa:"#ffff33"};

    function newFilterBar(data, name) {

        var header = d3.keys(data[0]);
        var index = header.indexOf(name);

        var width = 550,
            height = 95;

        var x = d3.scaleLinear()
            .range([0, width-150])
            .domain([0, d3.max(data, function (d) {
                return +d[name];
            })]);

        var xAxis = d3.axisBottom(x);

        var brush = d3.brushX()
            .extent([[0, 0], [width-150, 20]]);

        if (name == 'gdp_per_year'){
            name="gdp";
            brush.on("brush", brushedGDP);}
        else if (name == 'hdi'){
            brush.on("brush", brushedHdi);}
        else if (name == 'population'){
            brush.on("brush", brushedPop);}


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

        function brushedPop() {
            var selection = d3.event.selection;
            rangeBrushes[0] = selection.map(x.invert, x);
            var filteredData = filterAllDataBrusher(data, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1])
            d3.select("#dotG").selectAll(".dot")
                .style("fill", function(d){
                    if (filteredData[0].includes(d["country"])){
                        return colors[d["continent"]];}
                    else{
                        return "gray";}
                })
            changeOnSecondary(filteredData[1]);
        };
        function brushedHdi() {
            var selection = d3.event.selection;
            rangeBrushes[2] = selection.map(x.invert, x);
            var filteredData = filterAllDataBrusher(data, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1])
            d3.select("#dotG").selectAll(".dot")
                .style("fill", function (d) {
                    if (filteredData[0].includes(d["country"])){
                        return colors[d["continent"]];}
                    else{
                        return "gray";}
                })
            changeOnSecondary(filteredData[1]);
        };
        function brushedGDP() {
            var selection = d3.event.selection;
            rangeBrushes[1] = selection.map(x.invert, x);
            var filteredData = filterAllDataBrusher(data, rangeBrushes[2], rangeBrushes[0], rangeBrushes[1])
            d3.select("#dotG").selectAll(".dot")
                .style("fill", function(d){
                    if (filteredData[0].includes(d["country"])){
                        return colors[d["continent"]];}
                    else{
                        return "gray";}
                })
            changeOnSecondary(filteredData[1]);
        };

    }

    newFilterBar(data, "population");
    newFilterBar(data, "gdp_per_year");
    newFilterBar(data, "hdi");
}


function changeOnSecondary(tmpData){
    var filteredData = filterAllDataCheckbox(tmpData, male, female, age5_14, age15_24, age25_34,
        age35_54, age55_74, age75, genGi, genSilent, genBoomers, genX,
        genMillenials, genZ);


    if(document.getElementById("svgParallel") != null) {
        d3.select("#secondDiagram").selectAll("svg").remove();
        drawParallelCoordinatesChart("#secondDiagram",filteredData)}

    if(document.getElementById("svgScatter") != null) {
        d3.select("#secondDiagram").selectAll("svg").remove();
        drawScatterplot("#secondDiagram",filteredData)    }

    if(document.getElementById("patternDiv") != null) {
        d3.select("#secondDiagram").selectAll("svg").remove();
        drawPatternBarchart("#secondDiagram",filteredData)
    }
};

function filterRangeHdi(data, min, max){
    var filteredData = [];
    for(i=0; i<data.length; i++){
        hdiValue = parseFloat(data[i].hdi);
        if(hdiValue >= min && hdiValue <= max){filteredData.push(data[i]);}
    }
    return filteredData;
}
function filterRangePopulation(data, min, max){
    var filteredData = [];
    for(i=0; i<data.length; i++){
        hdiValue = parseFloat(data[i].population);
        if(hdiValue >= min && hdiValue <= max){filteredData.push(data[i]);}
    }
    return filteredData;
}
function filterRangeGdp(data, min, max){
    var filteredData = [];
    for(i=0; i<data.length; i++){
        hdiValue = parseFloat(data[i].gdp_per_year);
        if(hdiValue >= min && hdiValue <= max){filteredData.push(data[i]);}
    }
    return filteredData;
}
function filterAllDataBrusher(data, hdiRange, popRange, gdpRange){
    var filter = filterRangePopulation(data, popRange[0], popRange[1]);
    var filteredCountry=[];
    if (gdpRange.length != 0){
        filter = filterRangeGdp(filter, gdpRange[0], gdpRange[1]);}
    if (hdiRange.length != 0){
        filter = filterRangeHdi(filter, hdiRange[0], hdiRange[1]);}

    for(i=0; i<filter.length; i++){
        filteredCountry.push(filter[i].country)
    }
    return [filteredCountry, filter];
}

function filterSex(data, male, female){
    var filteredData = [];
    for(i=0; i<data.length; i++){
        if(male){if(data[i].sex == 'male'){filteredData.push(data[i]);}}
        if(female){if(data[i].sex == 'female'){filteredData.push(data[i]);}}
    }
    /*
    if(male){filteredData.push(data.filter(function(row){return row['sex'] == 'male';}));}
    if(female){filteredData.push(data.filter(function(row){return row['sex'] == 'female';}));}
    */
    return filteredData;
}
function filterAge(data, age5_14, age15_24, age25_34, age35_54, age55_74, age75){
    var filteredData = [];
    for(i=0; i<data.length; i++){
        //for(j=0; j<data[i].length; j++){
            if(age5_14){if(data[i].age == '5-14 years'){filteredData.push(data[i]);}}
            if(age15_24){if(data[i].age == '15-24 years'){filteredData.push(data[i]);}}
            if(age25_34){if(data[i].age == '25-34 years'){filteredData.push(data[i]);}}
            if(age35_54){if(data[i].age == '35-54 years'){filteredData.push(data[i]);}}
            if(age55_74){if(data[i].age == '55-74 years'){filteredData.push(data[i]);}}
            if(age75){if(data[i].age == '75+ years'){filteredData.push(data[i]);}}
        //}
    }
    return filteredData;
}
function filterGeneration(data, genGi, genSilent, genBoomers, genX, genMillenials, genZ){
    var filteredData = [];
    for(i=0; i<data.length; i++){
        //console.log(data[i].generation);
        //for(j=0; j<data[i].length; j++){
            if(genGi){if(data[i].generation == 'G.I. Generation'){filteredData.push(data[i]);}}
            if(genSilent){if(data[i].generation == 'Silent'){filteredData.push(data[i]);}}
            if(genBoomers){if(data[i].generation == 'Boomers'){filteredData.push(data[i]);}}
            if(genX){if(data[i].generation == 'Generation X'){filteredData.push(data[i]);}}
            if(genMillenials){if(data[i].generation == 'Millenials'){filteredData.push(data[i]);}}
            if(genZ){if(data[i].generation == 'Generation Z'){filteredData.push(data[i]);}}
        //}
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



function worldMap(visualElement) {

    var margin = {top: 0, right: 10, bottom: 0, left: 20};
    var width = 550 ;
    var height = width / 2.2;

    var projection,path,svg,g;
    //color from colorbrewer qualitative scale
    var colors = {Europe:"#e41a1c",Antartide:"#377eb8",Asia:"#4daf4a",Americas:"#984ea3",Oceania:"#ff7f00",Africa:"#ffff33"};


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
        .attr("transform", "translate( 20 , 10)")
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
        .style("visibility","hidden");

    g = svg.append("g");

    d3.json("dataset/world.json")
        .then(function (world) {
            var countries = topojson.feature(world, world.objects.countries).features;

            topo = countries;
            draw(topo);
        });


    function draw(topo) {

        var data = filterOutNullRecords(dataFull)

        var country = g.selectAll(".country").data(topo);
        var states = data.map(function(p){return p.country})
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
            .on("click",function(m) {
                if(selectedCountries.includes(m.properties.name)){
                    d3.select(this).style("stroke","none").style("stroke-width", "none");
                    //if condition needed because this statement remove last element when index not found
                    selectedCountries.splice( selectedCountries.indexOf(m.properties.name), 1 );
                }else{
                    d3.select(this).style("stroke","#fff").style("stroke-width", ".9px");
                    selectedCountries.push(m.properties.name);}
                d3.select("#dotG").selectAll(".dot")
                    .style("fill", function(d){
                        if (selectedCountries.includes(d.country)){
                            return colors[d.continent];}
                        else{
                            return "gray";}
                    })
                    .style("fill-opacity", function(d){
                        if (selectedCountries.includes(d.country)){
                            return "1";}
                        else{
                            return "0.2";}
                    })
                    .each(function(d) {
                        if (selectedCountries.includes(d.country)) {
                            d3.select(this).moveToFront();
                        }
                    });

            });


        blankMap.style("fill", function(d, i) {
            if (states.includes(d.properties.name)){
                for(i=0; i<data.length; i++){
                    if(male){if(data[i].country == d.properties.name){
                        return colors[data[i].continent];}}
                }
            }
            else{
                return "gray";}
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






