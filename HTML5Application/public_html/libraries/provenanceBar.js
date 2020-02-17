/**
 * In this script there is the management of the provenance bar, in particular
 * the save of miniature in provanance bar and the management of the recap page
 * named review.html
 */

// This function save a miniature of the diagram in the provenance bar
function saveSvgFile(visualElement, svgElement, arraySvgToSave) {
    var newSvg;
    // Case of array of barcharts
    if(Array.isArray(svgElement)){
        d3.select("#provenanceBar").append("div")
            .attr("class","provenanceElem")
            .style("display","inline-flex")
            .attr("width","200px")
            .style("transform","translate(0,"+ (provenanceContainer*200 +15)+ ")")
            .attr("id","divContainer"+provenanceContainer);
        /*
        for(i=0; i<svgElement.length; i++) {
            newSvg = svgElement[i].cloneNode(true);
            newSvg.setAttribute("height", 200);
            newSvg.style.transform = "scaleY(0.06)";

            document.getElementById("divContainer" + provenanceContainer).appendChild(newSvg);
        }
        */
        newSvg = document.createElement("P");
        newSvg.innerHTML = "<br>No icon available<br>";      
        document.getElementById("divContainer" + provenanceContainer).appendChild(newSvg);
        
        var strSvg = (new XMLSerializer).serializeToString(document.getElementById("divContainer"+provenanceContainer));
        arraySvgToSave.push(strSvg);
        provenanceContainer = provenanceContainer + 1;

        // To save the input that will be showed in page review
        try {sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
        } catch(err) {console.log("Stop adding: memory full");}
    }
    // Case single svg (other statistical diagrams)
    else {
        newSvg = svgElement.cloneNode(true);
        newSvg.setAttribute("id","cloned"+provenanceContainer);
        newSvg.style.transform="scale(0.2,0.32)";

        d3.select("#provenanceBar").append("svg")
            .attr("class","provenanceElem")
            .attr("width","200px").attr("height","auto")
            .style("transform","translate(0,"+ (provenanceContainer*200 +15)+ ")")
            .attr("id","svgContainer"+provenanceContainer);
        document.getElementById("svgContainer"+provenanceContainer).appendChild(newSvg);
        provenanceContainer = provenanceContainer + 1;
      
        var strSvg = (new XMLSerializer).serializeToString(newSvg);
        arraySvgToSave.push(strSvg);
        
        // To save the input that will be showed in page review
        try {sessionStorage.setItem("svgFromProvenance", JSON.stringify(arraySvgToSave));
        } catch(err) {console.log("Stop adding: memory full");}
    }
}

// In session storage all the svgs are saved, so we pick the elements from there
function copyToReview(divId){
    var strSvg = JSON.parse(sessionStorage.getItem("svgFromProvenance"));
    var div = d3.select(divId);

    var strLen = strSvg.length;
    for(j=0; j<strLen; j++){
        var svgDiv = div.append("div").style("display","inline-flex");
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