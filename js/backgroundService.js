/*
    Listening for alerts.
*/

var currentCities = [];
var currentAlertCities = []; // All cities of this alert (For alert message)
var interval;

window.addEventListener("load", (event) => {    
    // Start sse connection
    SSEConnection();
});

function SSEConnection(){
    /*
        SSE connection
    */
    sse = new EventSource("https://xxxxxxxxxxx"); // Tzofar SSE

    sse.addEventListener("ALERT", (e) => {
        const data = JSON.parse(e.data);
        getAlerts(data);
    })

    sse.addEventListener("INITIAL", async (e) => {
        const data = JSON.parse(e.data);
        Preferences.setPolygonsVersion(data.polygonsVersion, ()=> City.loadData());
        Preferences.setCitiesVersion(data.citiesVersion, ()=> City.loadData());
    })

    sse.onopen = (e) => {
        console.log("connected");
    }

    sse.onerror = (e) => {
        sse.close();
        setTimeout(function() {
            SSEConnection()
        }, 5000);
    }
}

async function getAlerts(alert, testAlert = false) {
    /*
        Handler - New alert received!
    */
    const selectionCitiesIDs = await Preferences.getSelectedCities();

    // Get alert cities & filter by cities selection
    var alertCities = alert["cities"].map(cityValue => new City(cityValue, alert["threat"], alert["time"]));
    alertCities = alertCities.filter(city => selectionCitiesIDs.includes(city.id) || selectionCitiesIDs.length == 0 || testAlert)
    if (alertCities.length == 0) return;

    // Show notify & play sound
    Preferences.playSound();

    // To show all the cities
    currentCities = currentCities.concat(alertCities);
    currentAlertCities = currentAlertCities.concat(alertCities);

    // Update data and refresh after countdown finish.
    updateData(true, alertCities);    
}

var lastData = [];
async function updateData(isNewData, alertCities = []) {
    // Filter list by countdown & alert's timestamp
    currentCities = currentCities.filter(city => {return city.getCountdown() > 0});
    if (currentCities.length == 0) return finishAlert();
    
    // Refresh data every 1 sec (To remove when countdown finish)
    if (interval == null) interval = setInterval(() => {
        updateData(false);
    }, 1000);

    // If data was changed, update in popup.
    if (!equalArrays(currentCities, lastData)) {
        // If is not new data, dont open the alert window again
        if (isNewData) {
            // Check what type of notification we need to create
            const desktop = await Preferences.getSelectedDesktop();
            if (desktop && alertCities.length) {
                // To show only the newest
                notify(alertCities);
            } else {
                const alertsOverSites = await Preferences.getSelectedAlertsOverSites();
                const isPopupOpen = chrome.extension.getViews({type: "popup"}).length > 0;
                var query = {active: true};
                (isPopupOpen) ? query.lastFocusedWindow = true : query.currentWindow = true;
                chrome.tabs.query(query, async(tabs) => {
                    if (tabs.length == 0 || !alertsOverSites)
                        popup();
                    else {
                        const hasContentScript = await new Promise((resolve, reject) => chrome.tabs.sendMessage(tabs[0].id, 'contentScript', response => (chrome.runtime.lastError) ? resolve(false) : resolve(response)));
                        if (!hasContentScript) popup();
                    }
                });
            }
        }
        chrome.tabs.query({}, tabs => tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, {cities: this.currentCities})));
    }

    lastData = currentCities;
}

function finishAlert() {
    /*
        Alert ended
    */
    // Clear all data
    currentCities = [];
    currentAlertCities = [];
    lastData = [];
    if (interval != null) {
        clearInterval(interval);
        interval = null;
    }

    // Close popup window
    chrome.tabs.query({}, tabs => tabs.forEach(tab => chrome.tabs.sendMessage(tab.id, {cities: this.currentCities})));
}

function equalArrays(one, two) {
    if (one.length == 0 && two.length == 0 || one.length != two.length) return false;
    var same = true;
    one.forEach((a, i) => {if (a != two[i]) same = false});
    return same;
}

async function notify(cities) {
    /*
        Show notification
    */
    const siteLanguage = await Preferences.getSelectedLanguage();
    City.siteLanguage = siteLanguage;

    // Sort list by Threats & Areas
    var newList = Preferences.sortCitiesByThreats(cities);
    Object.keys(newList).forEach(threatID => {
        var areasNames = [];
        var citiesNames = [];

        Object.keys(newList[threatID]).forEach(areaName => {
            areasNames.push(areaName);
            citiesNames = citiesNames.concat(newList[threatID][areaName]);
        });

        const TITLE = City.getLocalizationThreatTitle(threatID) + ": " + areasNames.join(", ");
        const MESSAGE = citiesNames.join(", ");

        // Desktop
        var options = {
            "type": "basic",
            "title": TITLE,
            "message": MESSAGE,
            "iconUrl": "../img/notify.png",
            "buttons": [
                { title: STRINGS.copyButton[siteLanguage.toLowerCase()] || STRINGS.copyButton.he },
                { title: STRINGS.openMapButton[siteLanguage.toLowerCase()] || STRINGS.openMapButton.he }
            ]
        }
        chrome.notifications.create(options);
    });
}

// Buttons in the desktop notifications
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (btnIdx === 0) {
        Preferences.copyAlert(this.currentAlertCities);

    } else if (btnIdx === 1) {
        Preferences.launchSiteMap();
    }
});

var popupId;
var isPopupCreating = false;
async function popup() {
    if (isPopupCreating) return;
    isPopupCreating = true;
    var options = {
        'url': '../alert.html',
        'type': 'popup',
        'width': 700,
        'height': 270,
        'left': 10,
        'top': window.screen.height
    };
    try {
        const preventfocus = await Preferences.getSelectedBackgroundHidePopup();
        options.focused = !preventfocus;
        if (!popupId)
            popupId = await new Promise((resolve, reject) => chrome.windows.create(options, window => resolve(window.id)));
        else
            popupId = await new Promise((resolve, reject) => chrome.windows.update(popupId, { "focused": !preventfocus }, window => (chrome.runtime.lastError) ? chrome.windows.create(options, window => resolve(window.id)) : resolve(popupId)));
    
    } catch (error) {}
    isPopupCreating = false;
}

// Return current cities
chrome.runtime.onMessage.addListener(async(value, sender, sendResponse) => {
    switch (value) {
        case 'currentCities':
            return sendResponse(this.currentCities);

        case 'currentAlertCities':
            return sendResponse(this.currentAlertCities);
        
        case 'testAlert':
            const siteLanguage = await Preferences.getSelectedLanguage();
            return getAlerts({"cities": [(STRINGS.testAlert[siteLanguage.toLowerCase()] || STRINGS.testAlert.he)], "threat":Math.floor(Math.random() * 8), "time":Math.floor(Date.now() / 1000)}, true);
    }
});