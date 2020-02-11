
var colors = {Europe:"#e41a1c",Antartide:"#377eb8",Asia:"#4daf4a",Americas:"#984ea3",Oceania:"#ff7f00",Africa:"#ffff33"};

function slideYear(visualElement, data){

    var value = 0;
    var years = data.map(function(d) { return d.year });

    var sliderStep = d3.sliderBottom()
      .min(d3.min(years))
      .max(d3.max(years))
      .width(900)
      .tickFormat(d3.format("d"))
      .ticks(26)
      .step(1)
      .default(1990)
      .on('onchange', function (val){parseYear(val)});

    var gStep = d3
      .select(visualElement)
      .append('svg')
      .attr('width', 1000)
      .attr('height', 70)
      .append('g')
      .attr('transform', 'translate(60,15)')
      .call(sliderStep);

    function parseYear(year) {
        var filteredData = data.filter(function(row) {
            return row['year'] == year;
        });
//TODO:remove remove secondary and set them coordinated
        d3.select("#secondDiagram").selectAll("svg").remove();
        d3.select("#secondDiagram").selectAll("div").remove();

        d3.select("#mainDiagram").selectAll(".tooltip").remove();

       // d3.select("#mainDiagram").selectAll("#mainChange").selectAll("svg").remove();

        d3.selectAll(".filterBrush").remove();
        filters("#filters", filteredData);
        changeMainDiagram("#mainDiagram", filteredData);
        if(selectedCountries.length != 0){
            d3.select("#dotG").selectAll(".dot")
                .style("fill", function(d){
                    if (selectedCountries.includes(d.country)){
                        return colors[d.continent];}
                    else{
                        return "gray";}
                })
        }
        dataYear = filteredData;
        selectionData = [];
    }
}

