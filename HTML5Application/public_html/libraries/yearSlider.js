
// Step
function slideYear(visualElement, data){
    /*data = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 
        2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,
        2015,2016];*/
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
      .on('onchange', function(val){
        console.log(val);
      });

    var gStep = d3
      .select(visualElement)
      .append('svg')
      .attr('width', 1000)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)');
      
    gStep.call(sliderStep);
    return value;
}
