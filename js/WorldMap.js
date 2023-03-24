function zoomEffect() {
    const NF = 16, 
			NAV_MAP = {
				187: { dir:  1, act: 'zoom', name: 'in' } /* + */, 
				 61: { dir:  1, act: 'zoom', name: 'in' } /* + WTF, FF? */, 
				189: { dir: -1, act: 'zoom', name: 'out' } /* - */, 
				173: { dir: -1, act: 'zoom', name: 'out' } /* - WTF, FF? */, 
				 37: { dir: -1, act: 'move', name: 'left', axis: 0 } /* ⇦ */, 
				 38: { dir: -1, act: 'move', name: 'up', axis: 1 } /* ⇧ */, 
				 39: { dir:  1, act: 'move', name: 'right', axis: 0 } /* ⇨ */, 
				 40: { dir:  1, act: 'move', name: 'down', axis: 1 } /* ⇩ */
			}, 
			_SVG = document.querySelector('svg'), 
			VB = _SVG.getAttribute('viewBox').split(' ').map(c => +c), 
			DMAX = VB.slice(2), WMIN = 8;

    let rID = null, f = 0, nav = {}, tg = Array(4);

    function stopAni() {
        cancelAnimationFrame(rID);
        rID = null;  
    };

    function update() {	
        let k = ++f/NF, j = 1 - k, cvb = VB.slice();

        if(nav.act === 'zoom') {		
            for(let i = 0; i < 4; i++)
                cvb[i] = j*VB[i] + k*tg[i]
        }

        if(nav.act === 'move')	 {
            cvb[nav.axis] = j*VB[nav.axis] + k*tg[nav.axis];
        }
        _SVG.setAttribute('viewBox', cvb.join(' '));

        if(!(f%NF)) {
            f = 0;
            VB.splice(0, 4, ...cvb);
            nav = {};
            tg = Array(4);
            stopAni();
            return;
        }
        rID = requestAnimationFrame(update)
    }

    addEventListener('keydown', e => { e.preventDefault() }, false);
    addEventListener('keypress', e => { e.preventDefault() }, false);

    addEventListener('keyup', e => {
        e.preventDefault();
            
        if(!rID && e.keyCode in NAV_MAP) {
            nav = NAV_MAP[e.keyCode];
            
            if(nav.act === 'zoom') {
                if((nav.dir === -1 && VB[2] >= DMAX[0]) || 
                    (nav.dir ===  1 && VB[2] <= WMIN)) {
                    //console.log(`cannot ${nav.act} ${nav.name} more`);
                    return
                }
                
                for(let i = 0; i < 2; i++) {
                    tg[i + 2] = VB[i + 2]/Math.pow(2, nav.dir);
                    tg[i] = .5*(DMAX[i] - tg[i + 2]);
                }
            }
            
            else if(nav.act === 'move') {
                if((nav.dir === -1 && VB[nav.axis] <= 0) || 
                    (nav.dir ===  1 && VB[nav.axis] >= DMAX[nav.axis] - VB[2 + nav.axis])) {
                    //console.log(`at the edge, cannot go ${nav.name}`);
                    return
                }
                
                tg[nav.axis] = VB[nav.axis] + .5*nav.dir*VB[2 + nav.axis];
            }
            
            update()
        }
    }, false);
}

async function getData(place) {
    
    const url = `https://restcountries.com/v3.1/name/${place}?fullText=true`;
    const res = await fetch(url);
    json = await res.json();    
    data = json[0];
    console.log(data)
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

var countries = document.querySelectorAll("path");
var countryList = Array.from(countries);

// Event Listeners
// Loop through all path elements, add 3 events to each path
countryList.forEach(elem=>{

    elem.addEventListener("mouseover",function(){
        // Get all elements with same name as current element
        list = document.getElementsByName(elem.getAttribute("name"));
        for(let i = 0;i<list.length;i++) {
            list[i].style.fill = 'darkgrey';
        }
    })

    elem.addEventListener("mouseleave",function() {
        // Get all elements with same name as current element
        list = document.getElementsByName(elem.getAttribute("name"));
        for(let i = 0;i<list.length;i++) {
            list[i].style.fill = '#ececec';
        }
    })

    elem.addEventListener("click",function(event){
        // API Call
        getData(elem.getAttribute("name"));
    })

})

// ZOOM EFFECT
zoomEffect()