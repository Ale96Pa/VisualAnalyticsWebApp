/**
 * 
 */

function saveLogicSvg(visualElement, svgElement){
    var newSvg = svgElement.cloneNode(true);
    //newSvg.setAttribute("id", "cloned");
    newSvg.setAttribute("height", 200);
    newSvg.setAttribute("width", 200);
    //newSvg.setAttribute("viewBox", "0 0 32 32");
    document.getElementById(visualElement).appendChild(newSvg);

    // To save the input that will be showed in page review
    var strSvg = (new XMLSerializer).serializeToString(newSvg);
    return strSvg;
}


// Pick an svg and clone it to visualize it in the provenance bar
function saveSvgFile(visualElement, svgElement, arraySvgToSave) {
    
    if(Array.isArray(svgElement)){
        for(i=0; i<svgElement.length; i++){
            var strSvg = saveLogicSvg(visualElement, svgElement[i]);
            arraySvgToSave.push(strSvg);
        }
        try {
        sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
        } catch(err) {
        //document.getElementById("demo").innerHTML = err.message;
        console.log("Stop adding: memory full");
        }
    } else { 
        var strSvg = saveLogicSvg(visualElement, svgElement);
        arraySvgToSave.push(strSvg);
        try {
        sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
        } catch(err) {
        console.log("Stop adding: memory full");
        //document.getElementById("demo").innerHTML = err.message;
        }
    }
}

// The text of the svg is saved in local session: each time we save, we need to
// attach the svg in the session storage
function copyToReview(divId){

    var strSvg = JSON.parse(sessionStorage.getItem("svgFromProvenance"));    
    var div = document.getElementById(divId);
    
    div.innerHTML = strSvg;
    
}