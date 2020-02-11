/**
 * 
 */

var i = 0;

// Pick an svg and clone it to visualize it in the provenance bar
function saveSvgFile(visualElement, svgElement, arraySvgToSave) {

    if(Array.isArray(svgElement)){
        //barchart case
        for(i=0; i<svgElement.length; i++){
            var newSvg = svgElement[i].cloneNode(true);
            //newSvg.setAttribute("id", "cloned");
            newSvg.setAttribute("height", 200);
            newSvg.setAttribute("width", 40);
            document.getElementById(visualElement).appendChild(newSvg);

            // To save the input that will be showed in page review
            var strSvg = (new XMLSerializer).serializeToString(newSvg);

            arraySvgToSave.push(strSvg);

        }
        try {
            sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
        } catch(err) {
            //document.getElementById("demo").innerHTML = err.message;
            console.log("Stop adding: memory full");
        }

    } else {
        var newSvg = svgElement.cloneNode(true);

        newSvg.style.transform="scale(0.2,0.32)"
        d3.select("#provenanceBar").append("svg")
            .attr("class","provenanceElem")
            .attr("width","200px").attr("height","auto")
            .style("transform","translate(0,"+ (i*200 +15)+ ")")
            .attr("id","svgContainer"+i);
        document.getElementById("svgContainer"+i).appendChild(newSvg);
        i += 1;

        // To save the input that will be showed in page review
        var strSvg = (new XMLSerializer).serializeToString(newSvg);
        
        arraySvgToSave.push(strSvg);
        try {
            sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
        } catch(err) {
            console.log("Stop adding: memory full");
            //document.getElementById("demo").innerHTML = err.message;
        }

        console.log(arraySvgToSave);
    }
    
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