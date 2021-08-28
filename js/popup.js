/*
    Set the language of the site.
*/
var siteLanguage;
var allCities;

window.addEventListener("load", async (event) => {
    siteLanguage = await Preferences.getSelectedLanguage();
    allCities = await City.getAllCities();
    loadSettings();
});

var currentPage = "Home";
(function(){
    document.querySelectorAll(".tablink").forEach(element => {
        element.onclick = function() {
            // Update the current page ID
            currentPage = element.getAttribute('forPageID');

            // Clear background from all tab buttons
            document.querySelectorAll(".tablink").forEach(tab=>{tab.style.backgroundColor=""});

            // Hide all pages
            document.querySelectorAll(".page").forEach(tab=>{tab.style.display=""});

            // Show the specific page
            document.getElementById(currentPage).style.display = "block";

            // Add the specific color to the button used to open the page
            element.style.backgroundColor = "rgb(228, 0, 0)";

            // On load page callback
            onPageLoad(currentPage);
        }
    });
    // Open the default tab
    document.querySelector('.tablink[forPageID="'+currentPage+'"]').click();
})();

function onPageLoad(Page) {
    /* 
        Page change handler
    */
    switch (Page) {
        case "Home":
            loadHistory();
            break;
    
        default:
            break;
    }
}

async function loadHistory(){
    if (document.getElementById("history")) document.getElementById("history").remove();
    var homeDiv = document.getElementById("Home");
    var history = document.createElement("div");
    history.setAttribute("id", "history");

    const feed = await fetch("https://api.tzevaadom.co.il/alerts-history/").then(async (r) => JSON.parse(await r.text())).catch(() => []);
    feed.forEach(data => {
        var historyItem = new History(data);
        var dateString = historyItem.getDate();
        var citiesNames = historyItem.getCitiesNames();
        var areasNames = historyItem.getAreasNames();
        var iconsDiv = historyItem.getThreatsIconsElements();

        item = document.createElement("div");
        item.classList.add("history_item");
        item.innerHTML = 
                '<div>'
                + '<p class="areas">' + areasNames.join(", ") + '</p>'
                + '<p class="date">' + dateString + '</p>'
                + '<p class="cities">' + citiesNames.join(", ") + '</p>'
              + '</div>';
        item.appendChild(iconsDiv);
        history.appendChild(item);
    });
    homeDiv.appendChild(history);
}

/* Cities Selection */
var selectionCitiesIDs = [];
var founds = [];
var currentFocusIndex;
document.getElementById("search").oninput = async function(e) {
    const searchText = this.value;

    if (document.getElementById("autocomplete")) document.getElementById("autocomplete").remove();
    if (!searchText || !searchText) return; // No text to search...

    const allCities = await City.getAllCities() || [];
    founds = allCities.filter(city => city.getLocalizationCityName().toLowerCase().replace(/[0-9 ~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '').includes(searchText.toLowerCase().replace(/[0-9 ~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, ''))).slice(0, 5);
    if (!founds.length) return; // No search options...

    var autocomplete = document.createElement("div");
    autocomplete.setAttribute("id", "autocomplete");

    founds.forEach((city, index) => {
        var option = document.createElement("button");
        option.classList.add("card");
        option.innerHTML = 
              '<p>' + city.getLocalizationCityName() + '</p>'
            + '<p>' + new Area(city.areaID).getLocalizationAreaName() + '</p>';
        option.onclick = function(e) {
            currentFocusIndex = index;
            onClickOption();
        };
        autocomplete.appendChild(option);
    });

    document.querySelector("#selection div").appendChild(autocomplete);
    currentFocusIndex--;
}

function updateFocus() {
    let options = document.querySelectorAll("#autocomplete button");
    options.forEach(node => node.classList.remove("focused"));
    if (currentFocusIndex == -1){
        document.getElementById("search").focus();
        document.getElementById("search").value = document.getElementById("search").value;
    }
    if (!options[currentFocusIndex]) return;
    options[currentFocusIndex].classList.add("focused");
    options[currentFocusIndex].scrollIntoView(false);
}

function onClickOption() {
    const selectedCity = founds[currentFocusIndex];
    if (!selectedCity) return;

    if (document.getElementById("autocomplete")) document.getElementById("autocomplete").remove();
    document.getElementById("search").value = ""; // Clear search input

    // City has been selected before?
    if (selectionCitiesIDs.includes(selectedCity.id))
        return;

    // Add city
    selectionCitiesIDs.push(selectedCity.id);
    Preferences.saveSelectedCities(selectionCitiesIDs);
    loadSelectionCitiesUI();
}

document.getElementById("search").onkeydown = function(e) {
    if (!document.getElementById("autocomplete")) return;
    switch (e.keyCode) {
        case 40: // Down
            (currentFocusIndex == founds.length - 1) ? currentFocusIndex = 0 : currentFocusIndex++;
            break;
        case 38: // Up
            (currentFocusIndex == 0) ? currentFocusIndex = -1 : currentFocusIndex--;
            break;
        case 13: // Enter
            e.preventDefault();
            return onClickOption();
        default:
            return;
    }
    updateFocus();
};

document.getElementById("search").addEventListener("focusout", function(e){
    // Delay to save the selection
    setTimeout(function(){if (document.getElementById("autocomplete") != null) document.getElementById("autocomplete").remove()}, 200);
});

document.getElementById("search").onfocus = function(){
    document.getElementById("search").dispatchEvent(new Event('input'));
};

// Clear all selections
document.getElementById("clear").onclick = function(e) {
    selectionCitiesIDs = [];
    Preferences.saveSelectedCities(selectionCitiesIDs);
    loadSelectionCitiesUI();
};

function loadSelectionCitiesUI() {
    var container = document.getElementById("selected");
    container.innerHTML = "";

    allCities.filter(city=>{return selectionCitiesIDs.includes(city.id)}).forEach(city=>{
        var item = document.createElement("div");
        item.classList.add("item");
        item.classList.add("card");

        var removeBtn = document.createElement("button");
        removeBtn.setAttribute("cityID", city.id);
        removeBtn.classList.add("card");
        removeBtn.innerHTML = 'x';

        item.appendChild(removeBtn);
        item.innerHTML += '<p>' + city.getLocalizationCityName() + '</p>';
        container.appendChild(item);

        document.querySelector("button[cityID='"+city.id+"']").onclick = function(e){
            // Remove from selection
            selectionCitiesIDs = selectionCitiesIDs.filter(cityID=>{return cityID != city.id});
            Preferences.saveSelectedCities(selectionCitiesIDs);
            loadSelectionCitiesUI();
        };
    });

    if (!container.innerHTML)
        container.innerHTML = '<p style="text-align: center;font-size: 14px;color: #777777;">' + SELECTION_DESC[siteLanguage.toLowerCase()] + '</p>';
}

const desktopNotifications = document.getElementById("desktopNotifications");
const backgroundHidePopup = document.getElementById("backgroundHidePopup");
const alertsOverSites = document.getElementById("alertsOverSites");
const selectLanguage = document.getElementById("language");
const testAlert = document.getElementById('testAlert');

// Initialize triggers
desktopNotifications.onclick = () => Preferences.saveSelectedDesktop(desktopNotifications.checked);
backgroundHidePopup.onclick = () => Preferences.saveSelectedBackgroundHidePopup(backgroundHidePopup.checked);
alertsOverSites.onclick = () => Preferences.saveSelectedAlertsOverSites(alertsOverSites.checked);
selectLanguage.onchange = () => {
    siteLanguage = selectLanguage.value.toUpperCase();
    Preferences.saveSelectedLanguage(siteLanguage);
    location.reload();
}
testAlert.onclick = () => chrome.runtime.sendMessage("testAlert");

/* Load data from LocalStorage */
async function loadSettings(){
    // Load selection cities
    selectionCitiesIDs = await Preferences.getSelectedCities();
    loadSelectionCitiesUI();

    // Load selected sound
    const selectedSound = await Preferences.getSelectedSound();
    document.querySelectorAll('input[name="sound"').forEach(element => {
        const soundID = element.getAttribute("id");
        element.onclick = () => Preferences.saveSelectedSound(soundID, () => Preferences.playSound()); // Save & Test sound
        if (selectedSound == soundID) element.checked = true;
    });

    // Desktop notifications
    desktopNotifications.checked = await Preferences.getSelectedDesktop();

    // Hide popup when chrome is on background
    backgroundHidePopup.checked = await Preferences.getSelectedBackgroundHidePopup();

    // Alerts over sites
    alertsOverSites.checked = await Preferences.getSelectedAlertsOverSites();

    // App language
    selectLanguage.value = await Preferences.getSelectedLanguage();
}