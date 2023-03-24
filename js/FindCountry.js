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

function flash_message(text,color) {
    var container = document.getElementById('message-container');
     // Create Message and Fade it Out
    var message = document.createElement('p');
    message.innerText = text;
    message.classList.add("flash-message");
    message.style.backgroundColor = color;
    container.appendChild(message);
    // Remove message after Fade Out
    setTimeout(() => {
        message.remove();
    }, 3000);

}

function highlightCountry(elem, color) {
    // Get all elements with same name as current element (some countries have more than 1 element)
    list = document.getElementsByName(elem.getAttribute("name"))
    for(let i = 0;i<list.length;i++) {
        list[i].style.fill = color;
    }
}

// ADD EVENT LISTENERS
var countries = document.querySelectorAll("path");
var countryList = Array.from(countries);

countryList.forEach(elem=>{

    elem.addEventListener("mouseover",() => { highlightCountry(elem,'darkgrey') })

    elem.addEventListener("mouseleave",() => { highlightCountry(elem,'#ececec') });
})

// MAIN GAME
var playerScore = 0;
var possibleScore = 219;
var countriesRemaining = 219;
var targetCountry = countryList[Math.floor(Math.random() * countryList.length)]; // Random Country
var targetLabel = document.getElementById('target-country');
targetLabel.innerText = "Find: " + targetCountry.getAttribute('name');
var answerMessage = document.getElementById('answer-message');
var scoreLabel = document.getElementById('score');


zoomEffect();
window.onmouseup = function(e) {

    // Stop function if no more countries remaining
    if(countriesRemaining == 0) {
        targetLabel.innerText = 'Final Score:'
        return;
    }

    // Country clicked
    var countryGuess = e.target;
    if (countryGuess.getAttribute('name') !== null) {

        // CORRECT GUESS
        if (countryGuess.getAttribute('name') == targetCountry.getAttribute('name')) {

            highlightCountry(countryGuess, 'green');
            playerScore+=1;
            // Correct Answer Message
            flash_message("Correct!","green")
            

        // INCORRECT GUESS
        } else {

            highlightCountry(countryGuess, 'red');
            highlightCountry(targetCountry, 'green')

            // Incorrect Answer Message
            flash_message(`Wrong!, You Guessed ${countryGuess.getAttribute('name')}`,"red");
        }
        
        // Remove Target Country so no repeats occur (some countries have more than 1 element)
        var removalList = document.getElementsByName(targetCountry.getAttribute('name'))
        removalList.forEach(elem => {
            var index = countryList.indexOf(elem)
            countryList.splice(index,1);
        })

        // Update Score Label
        scoreLabel.innerText = `${playerScore}/${possibleScore}`

        countriesRemaining--;
        // Get Next Random Country
        targetCountry = countryList[Math.floor(Math.random() * countryList.length)];
        targetLabel.innerText = "Find: " + targetCountry.getAttribute('name');
    }

}