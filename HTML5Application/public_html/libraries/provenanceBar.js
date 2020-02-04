/**
 * 
 */

// Pick an svg and clone it to visualize it in the provenance bar
function saveSvgFile(visualElement, svgElement, arraySvgToSave) {
    
    var newSvg = svgElement.cloneNode(true);
    //newSvg.setAttribute("id", "cloned");
    newSvg.setAttribute("height", 200);
    newSvg.setAttribute("width", 200);
    //newSvg.setAttribute("viewBox", "0 0 32 32");
    document.getElementById(visualElement).appendChild(newSvg);

    // To save the input that will be showed in page review
    var strSvg = (new XMLSerializer).serializeToString(newSvg);
    
    // if strSvg is too big, sessionStorage canno manage too big element, so nothing is saved
    // need to find a way to store as few data as possible !!!
    //strSvg = "dac";
    arraySvgToSave.push(strSvg);
    
    sessionStorage.setItem("svgFromProvenance", strSvg);
    sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
    
    console.log(arraySvgToSave);
    
}

// The text of the svg is saved in local session: each time we save, we need to
// attach the svg in the session storage
function copyToReview(divId){

    var strSvg = JSON.parse(sessionStorage.getItem("svgFromProvenance"));
    console.log(strSvg);
    
    var div = document.getElementById(divId);
    div.innerHTML = strSvg;
    
    console.log(div);
}