/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function updatePopVal(val) {
    document.getElementById('popVal').innerHTML=val;
}
function updateGdpVal(val) {
    document.getElementById('gdpVal').innerHTML=val;
}
function updateHdiVal(val) {
    document.getElementById('hdiVal').innerHTML=val;
}
function filters(visualElement){
    
    var margin = {top: 10, right: 20, bottom: 500, left: 20},
    width = 650 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    d3.selectAll(visualElement)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("min", 0)
        .attr("max", 150)
        .attr("onchange", "updatePopVal(this.value);")
        .attr("oninput", "updateInput(this.value);");
    
}


