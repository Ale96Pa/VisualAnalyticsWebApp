
//qualitative scale from colorbrewer
var colors = {
    Europe: "#377eb8",
    Antartide: "#e41a1c",
    Asia: "#4daf4a",
    Americas: "#984ea3",
    Oceania: "#ff7f00",
    Africa: "#ffff33"
};

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
      .default(dataYear[0].year)
      .on('onchange', function (val){console.log("here");parseYear(val);});

    var gStep = d3
      .select(visualElement)
      .append('svg')
      .attr('width', 1000)
      .attr('height', 70)
      .append('g')
      .attr('transform', 'translate(60,15)')
      .call(sliderStep);

    function parseYear(year) {
        console.log("changeYear")
        var filteredData = data.filter(function (row) {
            return row['year'] == year;
        });


        //d3.select("#mainDiagram").selectAll(".tooltip").remove();

        //d3.select("#mainDiagram").selectAll("#mainChange").selectAll("svg").remove();

        d3.selectAll(".filterBrush").remove();

        filters("#filters", filteredData);
        drawMainDiagram("#mainDiagram", filteredData);

        if (selectedCountries.length != 0) {
            d3.select("#dotG").selectAll(".dot")
                .style("stroke", function (d) {
                    if (selectedCountries.includes(d.country)) {
                        return "red";
                    }
                })
                .style("stroke-width", function (d) {
                    if (selectedCountries.includes(d.country)) {
                        return ".9px"
                    }
                })
                .each(function (d) {
                    if (selectedCountries.includes(d.country)) {
                        d3.select(this).moveToFront()
                    }
                })
        }

        dataYear = filteredData;
        selectionData = [];

        changeOnSecondary(dataYear);

    }
}