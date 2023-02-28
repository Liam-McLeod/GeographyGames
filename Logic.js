let findBtn = document.getElementById("find-country-btn");
let worldleBtn = document.getElementById("worldle-btn");
let mapBtn = document.getElementById("map-btn");

// Link to Find the Country
findBtn.onclick = function () {
    location.href = "html/FindCountry.html";
}

// Link To Worldle
worldleBtn.onclick = function () {
    location.href = "html/Worldle.html";
}
// Link to World Map
mapBtn.onclick = function () {
    location.href = "html/WorldMap.html";
}