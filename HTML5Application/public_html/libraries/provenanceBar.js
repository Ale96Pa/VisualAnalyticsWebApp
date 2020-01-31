/**
 * 
 */

// Pick an svg and clone it to visualize it in the provenance bar
//TODO: THE SVG IN THE PROVENANCE BAR MUST BE ALSO COPIED IN ANOTHER PAGE !!!
function saveSvgFile(visualElement, svgElement) {
    
    var newSvg = svgElement.cloneNode(true);
    newSvg.setAttribute("id", "cloned");
    newSvg.setAttribute("height", 200);
    newSvg.setAttribute("width", 200);
    document.getElementById(visualElement).appendChild(newSvg);
    
    //localStorage.setItem('someName', newSvg);
 
}
/*
function copyToReview(visualElement){
    var display = localStorage.getItem('someName', display);
    var svg = display.cloneNode(true);
    svg = document.createElement("svg");
    svg.setAttribute("id", "svgReview");
    svg.setAttribute("height", 450);
    svg.setAttribute("width", 600);
    svg.innerHTML = display;
    console.log(svg);
      
    document.getElementById(visualElement).appendChild(svg);
}*/