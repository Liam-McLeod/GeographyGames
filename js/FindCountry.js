
// EVENT LISTENERS
// ADD TO EACH PATH(COUNTRY) ELEMENT

function highlightCountry(elem, color) {
    // Get all elements with same name as current element (some countries have more than 1 element)
    list = document.getElementsByName(elem.getAttribute("name"))
    for(let i = 0;i<list.length;i++) {
        list[i].style.fill = color;
    }
}

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
            answerMessage.innerText = "Correct!";
            answerMessage.style.color = 'green'
            

        // INCORRECT GUESS
        } else {

            highlightCountry(countryGuess, 'red');
            highlightCountry(targetCountry, 'green')


            // Incorrect Answer Message
            answerMessage.innerText = `Wrong!, You Guessed ${countryGuess.getAttribute('name')}`;
            answerMessage.style.color = 'red';
            
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