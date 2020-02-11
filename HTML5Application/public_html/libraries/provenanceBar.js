/**
 * 
 */


/*
function saveLogicSvg(svgElement){
    
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
    
    return strSvg;
}
*/

// Pick an svg and clone it to visualize it in the provenance bar
function saveSvgFile(visualElement, svgElement, arraySvgToSave) {

// TODO: per array di barchart mettere tutto in una riga nella provenance
    if(Array.isArray(svgElement)){
        //barchart case
        for(i=0; i<svgElement.length; i++){
            /*
            var newSvg = svgElement[i].cloneNode(true);
            //newSvg.setAttribute("id", "cloned");
            newSvg.setAttribute("height", 200);
            newSvg.setAttribute("width", 40);
            document.getElementById(visualElement).appendChild(newSvg);*/
            var newSvg = svgElement[i].cloneNode(true);
            newSvg.style.transform="scale(0.2,0.32)"
            d3.select("#provenanceBar").append("svg")
                .attr("class","provenanceElem")
                .attr("width","200px").attr("height","auto")
                .style("transform","translate(0,"+ (provenanceContainer*200 +15)+ ")")
                .attr("id","svgContainer"+provenanceContainer);
            document.getElementById("svgContainer"+provenanceContainer).appendChild(newSvg);
            provenanceContainer = provenanceContainer + 1;

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
            .style("transform","translate(0,"+ (provenanceContainer*200 +15)+ ")")
            .attr("id","svgContainer"+provenanceContainer);
        document.getElementById("svgContainer"+provenanceContainer).appendChild(newSvg);
        provenanceContainer = provenanceContainer + 1;

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
//TODO: vedere bene la grafica della pagina review.html
function copyToReview(divId){

    var strSvg = JSON.parse(sessionStorage.getItem("svgFromProvenance"));
    var div = d3.select(divId);
    for(j=0; j<strSvg.length; j++){
        div.append("svg").attr("id", "svg"+j);
        var svg = document.getElementById("svg"+j);
        svg.innerHTML = strSvg[j];
        svg.style.transform = "scale(2)";
    }
        
    
}

