
function getDistance(values) {
    var guesslat = values[0][0].latlng[0] * Math.PI/180;
    var guesslon = values[0][0].latlng[1] * Math.PI/180;

    var targetlat = values[1][0].latlng[0] * Math.PI/180;
    var targetlon = values[1][0].latlng[1] * Math.PI/180;
    
    // Haversine formula
    let dlon = targetlon - guesslon;
    let dlat = targetlat - guesslat;
    let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(guesslat) * Math.cos(targetlat)
            * Math.pow(Math.sin(dlon / 2),2);
            
    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    var distance = Math.ceil(c*r);
    return distance;
}

function validCountry(countryGuess,countryList) {
    var valid = false;
    for (i in countryList) {
        if (countryGuess.toLowerCase() == countryList[i].toLowerCase()) {
            valid = true;
            return valid;
        }
    }
    return valid;
}

// Stole from w3schools
function autocomplete(inp, countryList) {

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }  
    var currentFocus;
  /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < countryList.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (countryList[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + countryList[i].substr(0, val.length) + "</strong>";
            b.innerHTML += countryList[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + countryList[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
}

function addGuess(countryList,randomCountryName) {

    var userInput = document.getElementById('user-guess')
    var countryGuess = userInput.value;
    var input_container = document.getElementById('input-container');
    var textList = input_container.children;
    var textArray = Array.from(textList)
    var flag = false;
    // Reset input
    userInput.value = ""

    // Country Does not exist / Invalid
    if (!validCountry(countryGuess,countryList)) {
        var container = document.getElementById('message-container');
        // Create Message and Fade it Out
        var message = document.createElement('p');
        message.innerText = "Country Not Found!";
        message.classList.add("flash-message");
        container.appendChild(message);
        // Remove message after Fade Out
        setTimeout(() => {
            message.remove();
        }, 3000);
        return;
    }
    
    // Add Guess to first empty textbox
    textArray.forEach(item => {
        if (item.innerText == "" && !flag) {

            // Correct guess
            if (countryGuess.toLowerCase() == randomCountryName.toLowerCase()) {
                // Add Guess + Checkmark Icon
                item.innerHTML = countryGuess.toUpperCase() + "<i class='fa-solid fa-square-check'></i>";
                guessesRemaining--;
                flag = true;

                // Remove button and user input
                document.getElementById('guess-btn').remove();
                userInput.remove();

                // Tell user number of guesses
                const message = document.createElement('h3');
                message.innerText = `You guessed correctly in ${6-guessesRemaining} out of 6 tries`;
                input_container.appendChild(message);

            // Incorrect Guess
            } else {
                // Get Distance API CALL
                var distanceData = Promise.all([
                    fetch(`https://restcountries.com/v3.1/name/${countryGuess}?fullText=true`).then(resp => resp.json()),
                    fetch(`https://restcountries.com/v3.1/name/${randomCountryName}?fullText=true`).then(resp => resp.json())
                ]);
                // Process Data
                distanceData.then(values => {
                    var distance = getDistance(values)
                    // Add Country Guess, Distance, Direction, X Icon
                    item.innerHTML = countryGuess.toUpperCase() + distance+"KM" + "<i class='fa-solid fa-rectangle-xmark'></i>";
                });
                
                guessesRemaining--;
                flag = true;

                // Ran out of Guesses
                if (guessesRemaining == 0) {

                    // Remove button and user input
                    document.getElementById('guess-btn').remove();
                    userInput.remove();

                    // Tell user correct country
                    const message = document.createElement('h3');
                    message.innerText = `The correct country was ${randomCountryName}`;
                    input_container.appendChild(message);
                    
                }
            }
        }
    })
}

async function getCountry() {
    const url = "../js/Countries.json"
    const res = await fetch(url);
    var json = await res.json();
    var guessBtn = document.getElementById('guess-btn');
    var userInput = document.getElementById('user-guess');

    // Keys Are Country Codes
    var randomCountryCode = Object.keys(json)[Math.floor(Math.random() * Object.keys(json).length)];
    // Values are Country Names
    var randomCountryName = json[randomCountryCode];
    // Image Names are Country Codes
    var randomCountryImage = `../img/WorldleCountryImgs/all/${randomCountryCode.toLowerCase()}/256.png`;
    // All Country Names
    var countryList = Object.values(json);

    console.log(randomCountryName);

    // Display Country Image
    document.getElementById('random-country').setAttribute('src',randomCountryImage)
    
    // Event Listeners
    // Add Guess
    guessBtn.addEventListener("click", () => {addGuess(countryList,randomCountryName)})
    // Add Autocomplete
    autocomplete(userInput,countryList);

}

// ON PAGE LOAD
var guessesRemaining = 6;
getCountry();

