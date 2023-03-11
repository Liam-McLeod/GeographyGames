


async function getData(place) {
    
    const url = `https://restcountries.com/v3.1/name/${place}`;
    const res = await fetch(url);
    json = await res.json();    
    data = json[0];

    console.log(data);

    //Flag
    countryFlag = data.flags['svg'];
    // Common Name
    countryName = data.name.common;
    // Capital
    capitalCity = data.capital;
    // Populaton
    countryPopulation = data.population;
    // Area in km^2
    countryArea = data.area;
    // Currencies data (eg. Canadian Dollar ($ CAD))
    currencies = data.currencies;
    currencyAbb = Object.keys(currencies)[0];
    currencyName = currencies[currencyAbb].name;
    currencySymbol = currencies[currencyAbb].symbol

    // Setting data on page
    document.getElementById("flag").setAttribute("src",countryFlag);
    document.getElementById("country").innerText = countryName;
    document.getElementById("capital").innerText = `Capital: ${capitalCity}`;
    document.getElementById("population").innerText = `Population: ${countryPopulation}`;  
    document.getElementById("area").innerHTML = `Area: ${countryArea} km<sup>2</sub>`;  
    document.getElementById("currency").innerText = `Currency: ${currencyName} (${currencySymbol} ${currencyAbb})`;
}


var svgObject = document.getElementById('mySVG');
// Embedding SVG Image
svgObject.onload = function() {

    // Use to get SVG content
    var svgDoc = svgObject.contentDocument;

    // Loop through all path elements, add 3 events to each path
    svgDoc.querySelectorAll("path").forEach(elem=>{

        elem.addEventListener("mouseover",function(){
            // Get all elements with same name as current element
            list = svgDoc.getElementsByName(elem.getAttribute("name"))
            for(let i = 0;i<list.length;i++) {
                list[i].style.fill = 'darkgrey';
            }
        })

        elem.addEventListener("mouseleave",function() {
            // Get all elements with same name as current element
            list = svgDoc.getElementsByName(elem.getAttribute("name"))
            for(let i = 0;i<list.length;i++) {
                list[i].style.fill = '#ececec';
            }
        })

        elem.addEventListener("click",function(event){
            
            // Move info box near mouse click
            x=event.pageX;
            y=event.pageY;
            document.getElementById("info").style.top = y-20+'px';
            document.getElementById("info").style.left = x-350+'px';

            // API Call
            getData(elem.getAttribute("name"));
        })

    })
}