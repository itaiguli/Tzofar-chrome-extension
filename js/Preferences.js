class Preferences {
    static async getSelectedSound() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'selectedSound':'bell'}, value=>resolve(value.selectedSound)))}
    static saveSelectedSound(soundID, callback = ()=>{}) {chrome.storage.sync.set({selectedSound: soundID}, callback)}

    static async getSelectedCities() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'selectedCities':'[]'}, value=>resolve(JSON.parse(value.selectedCities))))}
    static saveSelectedCities(selectionCitiesIDs, callback = ()=>{}) {chrome.storage.sync.set({selectedCities: JSON.stringify(selectionCitiesIDs)}, callback)}

    static async getSelectedDesktop() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'desktopNotifications':false}, value=>resolve(value.desktopNotifications)))}
    static saveSelectedDesktop(value, callback = ()=>{}) {chrome.storage.sync.set({desktopNotifications: value}, callback)}

    static async getSelectedBackgroundHidePopup() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'backgroundHidePopup':false}, value=>resolve(value.backgroundHidePopup)))}
    static saveSelectedBackgroundHidePopup(value, callback = ()=>{}) {chrome.storage.sync.set({backgroundHidePopup: value}, callback)}

    static async getSelectedAlertsOverSites() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'alertsOverSites':true}, value=>resolve(value.alertsOverSites)))}
    static saveSelectedAlertsOverSites(value, callback = ()=>{}) {chrome.storage.sync.set({alertsOverSites: value}, callback)}

    static async getCitiesVersion() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'citiesVersion': 3}, value=>resolve(value.citiesVersion)))}
    static async setCitiesVersion(value, callback = ()=>{}) {
        const currentVersion = await Preferences.getCitiesVersion();
        if (value > currentVersion)
            chrome.storage.sync.set({citiesVersion: value}, callback);
    }

    static async getPolygonsVersion() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'polygonsVersion': 3}, value=>resolve(value.polygonsVersion)))}
    static async setPolygonsVersion(value, callback = ()=>{}) {
        const currentVersion = await Preferences.getPolygonsVersion();
        if (value > currentVersion)
            chrome.storage.sync.set({polygonsVersion: value}, callback);
    }

    static audioPlayer;
    static async playSound() {
        const soundID = await this.getSelectedSound();
        if (!soundID || soundID == "silent") return;

        const soundType = (soundID == "bell" || soundID == "tone") ? "mp3" : "wav";
        if (Preferences.audioPlayer && !Preferences.audioPlayer.paused) {
            Preferences.audioPlayer.pause();
        }
        Preferences.audioPlayer = new Audio(`../sounds/${soundID}.${soundType}`);
        Preferences.audioPlayer.play();
    }

    // Google Maps KEY
    static async getGoogleMapsKEY() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'googleMapsKEY': 'GOOGLE_MAPS_KEY'}, value=>resolve(value.googleMapsKEY)))}
    static async updateGoogleMapsKEY() {
        try {
            const data = await fetch("https://xxxxxxxxxxxxxxxx/xxx.json").then(async (r) => JSON.parse(await r.text())).catch(() => null);
            const googleMapsKEY = data.googleMapsKEY;
            if (googleMapsKEY.length > 0) chrome.storage.sync.set({googleMapsKEY: googleMapsKEY});
        } catch (error) {}
    }

    static timeConverter(UNIX_timestamp) {
        var date = new Date(UNIX_timestamp*1000);
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).substr(-2);
        var day = ("0" + date.getDate()).substr(-2);
        var hour = ("0" + date.getHours()).substr(-2);
        var minutes = ("0" + date.getMinutes()).substr(-2);
        var seconds = ("0" + date.getSeconds()).substr(-2);
        return day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;
    }

    static sortCitiesByThreats(cities) {
        /* 
            Sort cities array by Threats and Areas.
            example: {"0":{"Shfela":["Rehovot", "Ness ziona"]}, "5":{"Dan":["Holon"]}}
        */
        var sortedList = {};
        cities.forEach(city=>{
            // Get localization names
            var cityName = city.getLocalizationCityName();
            var areaName = new Area(city.areaID, city.value).getLocalizationAreaName();
            var threatIDStr = city.getThreatID().toString();

            // Add city name to his area
            if (!sortedList.hasOwnProperty(threatIDStr)) sortedList[threatIDStr] = {};
            if (!sortedList[threatIDStr].hasOwnProperty(areaName)) sortedList[threatIDStr][areaName] = [];
            sortedList[threatIDStr][areaName].push(cityName);
        });
        return sortedList;
    }

    static generateAlertMessage(alertCities, siteLanguage) {
        var list = {};
        alertCities.forEach(city => list[city.threat.toString()] = {});
        alertCities.forEach(city => list[city.threat.toString()][city.timestamp.toString()] = [].concat(list[city.threat.toString()][city.timestamp.toString()] || [], city));

        var alertText = "";
        Object.keys(list).forEach(threatID => {
            alertText += City.getLocalizationThreatTitle(parseInt(threatID)) + '\n\n';
            Object.keys(list[threatID]).forEach(timestamp => {
                alertText += Preferences.timeConverter(parseInt(timestamp)) + ':\n';
                const areasList = Preferences.sortCitiesByThreats(list[threatID][timestamp])[threatID];
                alertText += Object.keys(areasList).map(areaName => `• ${areaName}: ${areasList[areaName].join(', ')}`).join('\n');
                alertText += '\n\n';
            });
            alertText += '------------\n\n';
        });
        alertText += (STRINGS.sentVia[siteLanguage.toLowerCase()] || STRINGS.sentVia.he) + '\nhttps://www.tzevaadom.co.il/systems';
        return alertText;
    }

    static async getSelectedLanguage() {return new Promise((resolve, reject)=> chrome.storage.sync.get({'selectedLanguage':'HE'}, value=>resolve(value.selectedLanguage)))}
    static saveSelectedLanguage(languageCode, callback = ()=>{}) {
        chrome.storage.sync.set({selectedLanguage: languageCode}, callback);
        City.siteLanguage = languageCode;
    }

    static async copyAlert(cities = null) {
        const siteLanguage = await Preferences.getSelectedLanguage();
        const currentAlertCities = (cities) ? cities : await new Promise((resolve, reject) => chrome.runtime.sendMessage('currentAlertCities', response => (chrome.runtime.lastError) ? resolve([]) : resolve(response.map(city => new City(city.value, city.threat, city.timestamp)))));
        var input = document.createElement('textarea');
        document.body.appendChild(input);
        input.value = Preferences.generateAlertMessage(currentAlertCities, siteLanguage);
        input.focus();
        input.select();
        document.execCommand('Copy');
        input.remove();
    }

    static async launchSiteMap() {
        const siteLanguage = await Preferences.getSelectedLanguage();
        const url = "https://www.tzevaadom.co.il";
        const windowName = 'Tzofar' + siteLanguage;
        if (typeof Preferences.launchSiteMap.winrefs == 'undefined') Preferences.launchSiteMap.winrefs = {};
        if (typeof Preferences.launchSiteMap.winrefs[windowName] == 'undefined' || Preferences.launchSiteMap.winrefs[windowName].closed)
            Preferences.launchSiteMap.winrefs[windowName] = window.open(url, windowName);
        else
            Preferences.launchSiteMap.winrefs[windowName].focus()
    }
}