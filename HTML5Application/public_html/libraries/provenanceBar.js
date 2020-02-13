/**
 * 
 */

// Pick an svg and clone it to visualize it in the provenance bar
function saveSvgFile(visualElement, svgElement, arraySvgToSave) {

    var newSvg;
// TODO: per array di barchart mettere tutto in una riga nella provenance
    if(Array.isArray(svgElement)){
        d3.select("#provenanceBar").append("div")
            .attr("class","provenanceElem")
            .style("display","inline-flex")
            .attr("width","200px")
            .style("transform","translate(0,"+ (provenanceContainer*200 +15)+ ")")
            .attr("id","divContainer"+provenanceContainer);
            
        var strSvg;
        for(i=0; i<svgElement.length; i++) {
            
            newSvg = svgElement[i].cloneNode(true);
            newSvg.setAttribute("id","cloned"+provenanceContainer+i)
            newSvg.setAttribute("height", 200);
            newSvg.style.transform = "scale(0.2,0.32)"//"scaleY(0.06)"
            
            document.getElementById("divContainer"+provenanceContainer).appendChild(newSvg);
            
        }
        var strSvg = (new XMLSerializer).serializeToString(document.getElementById("divContainer"+provenanceContainer));
        arraySvgToSave.push(strSvg);
        provenanceContainer = provenanceContainer + 1;

        try {sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
        } catch(err) {console.log("Stop adding: memory full");}

    } else {
        d3.select("#provenanceBar").append("svg")
            .attr("class","provenanceElem")
            .attr("width","200px").attr("height","auto")
            .style("transform","translate(0,"+ (provenanceContainer*200 +15)+ ")")
            .attr("id","svgContainer"+provenanceContainer);
    
        newSvg = svgElement.cloneNode(true);
        newSvg.setAttribute("id","cloned"+provenanceContainer)
        newSvg.style.transform="scale(0.2,0.32)"
    
        document.getElementById("svgContainer"+provenanceContainer).appendChild(newSvg);
        provenanceContainer = provenanceContainer + 1;

        // To save the input that will be showed in page review
        var strSvg = (new XMLSerializer).serializeToString(newSvg);
        arraySvgToSave.push(strSvg);

        try {sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
        } catch(err) {console.log("Stop adding: memory full");}

    }
    
}

// The text of the svg is saved in local session: each time we save, we need to
// attach the svg in the session storage
//TODO: vedere bene la grafica della pagina review.html
function copyToReview(divId){

    var strSvg = JSON.parse(sessionStorage.getItem("svgFromProvenance"));
    var div = d3.select(divId);

    for(j=0; j<strSvg.length; j++){

        var svgDiv = div.append("div").style("display","inline-flex")

        svgDiv.append("div").attr("class","reviewRow").append("svg").attr("id", "svg"+j)
            .attr("height","350px").attr("width","900px");

        svgDiv.append("rect")
            .attr("x", 0).attr("y", 0)
            .attr("height", "300px").attr("width", "900px")
            .style("stroke", "white")
            .style("fill", "none");

        var svg = document.getElementById("svg"+j);
        svg.innerHTML = strSvg[j];
        d3.select("#svg"+j).selectAll("svg").style("transform", "scale(0.8)");

        svgDiv.append("div").attr("class","reviewRow").append("textarea")
            .style("min-width","250px")
            .style("max-width","250px")
            .style("min-height","300px")
            .style("max-height","300px")
            .html('Comment here');
    }

}

