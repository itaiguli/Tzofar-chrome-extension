class City {

    static CITIES_JSON = {};
    static POLYGONS = {};
    static siteLanguage;

    constructor(cityValue, threat, timestamp) {
        this.value = cityValue;
        this.threat = threat;
        this.timestamp = timestamp;
        var item;
        try {
            if (City.CITIES_JSON)
                item = City.CITIES_JSON["cities"].hasOwnProperty(cityValue) ? City.CITIES_JSON["cities"][cityValue] : null;
        } catch (error) {}
        if (!item) {
            this.cityHE = cityValue;
            this.cityEN = cityValue;
            this.cityES = cityValue;
            this.cityAR = cityValue;
            this.cityRU = cityValue;
            this.countdown = 0;
            this.lat = 0;
            this.lng = 0;
            this.id = -1;
            this.areaID = -1;
        } else {
            this.cityHE = item.he;
            this.cityEN = item.en;
            this.cityES = item.es;
            this.cityAR = item.ar;
            this.cityRU = item.ru;
            this.countdown = item.countdown;
            this.lat = item.lat;
            this.lng = item.lng;
            this.id = item.id;
            this.areaID = item.area;
        }
    }

    getCountdown() {
        var nowTime = Math.floor(Date.now() / 1000);
        return Math.max((((this.countdown == 0) ? 15 : this.countdown) + 10) - (nowTime - this.timestamp), 0);
    }

    getLocalizationCityName() {
        switch (City.siteLanguage) {
            case "EN":
                return this.cityEN;
            case "ES":
                return this.cityES;
            case "AR":
                return this.cityAR;
            case "RU":
                return this.cityRU;
            default:
                return this.cityHE;
        }
    }

    getThreatID() {return this.threat}

    static getLocalizationThreatTitle(threatID) {
        var item = THREATS_TITLES[threatID];
        switch (City.siteLanguage) {
            case "EN":
                return item.en;
            case "ES":
                return item.es;
            case "AR":
                return item.ar;
            case "RU":
                return item.ru;
            default:
                return item.he;
        }
    }

    static allCities;
    static async getAllCities() {
        if (this.allCities) return this.allCities;
        if (!City.CITIES_JSON) await loadData();
        this.allCities = Object.keys(City.CITIES_JSON["cities"]).map(cityValue => new City(cityValue, 0, 0));
        return this.allCities;
    }

    getPolygon() {
        var item = City.POLYGONS[this.id.toString()];
        if (item == null) return [];
        var final = [];
        item.forEach(point=>{final.push(new google.maps.LatLng(point[0], point[1]))});
        return final;
    }

    getPolygonCenter() {
        var bounds = new google.maps.LatLngBounds();
        this.getPolygon().forEach(p=>{bounds.extend(p)});
        return bounds.getCenter();
    }

    static async loadData() {
        City.siteLanguage = await Preferences.getSelectedLanguage();
        const citiesVersion = await Preferences.getCitiesVersion();
        const polygonsVersion = await Preferences.getPolygonsVersion();
    
        City.CITIES_JSON = JSON.parse(localStorage.getItem("citiesJSON") || "{}");
        if ((localStorage.getItem("citiesVersion") || -1) == citiesVersion && Object.keys(City.CITIES_JSON).length > 0) {
            console.log("cities was loaded successfully from localStorge.");
        } else {
            City.CITIES_JSON = await fetch("https://www.tzevaadom.co.il/static/cities.json?v=" + citiesVersion).then(async (r) => JSON.parse(await r.text())).catch(() => {});
            if (Object.keys(City.CITIES_JSON).length > 0) {
                localStorage.setItem("citiesJSON", JSON.stringify(City.CITIES_JSON));
                localStorage.setItem("citiesVersion", citiesVersion);
                console.log("cities was loaded successfully from server.");
            }
        }
    
        City.POLYGONS = JSON.parse(localStorage.getItem("polygonsJSON") || "{}");
        if ((localStorage.getItem("polygonsVersion") || -1) == polygonsVersion && Object.keys(City.POLYGONS).length > 0) {
            console.log("polygons was loaded successfully from localStorge.");
        } else {
            City.POLYGONS = await fetch("https://www.tzevaadom.co.il/static/polygons.json?v=" + polygonsVersion).then(async (r) => JSON.parse(await r.text())).catch(() => {});
            if (Object.keys(City.POLYGONS).length > 0) {
                localStorage.setItem("polygonsJSON", JSON.stringify(City.POLYGONS));
                localStorage.setItem("polygonsVersion", polygonsVersion);
                console.log("polygons was loaded successfully from server.");
            }
        }
    }
}

// Load cities & polygons from server.
City.loadData();