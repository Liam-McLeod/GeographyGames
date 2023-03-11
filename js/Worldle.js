var countries = document.querySelectorAll("path");
var countryList = Array.from(countries);


var targetCountry = countryList[Math.floor(Math.random() * countryList.length)]; // Random Country


list = document.getElementsByName(targetCountry.getAttribute('name'));

list.forEach(element => {
    document.getElementById('target').appendChild(element);
});

