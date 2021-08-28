/*
    {"id":283,"description":null,"alerts":[{"time":1626279901,"cities":["כרמית"],"threat":0}]}
*/
class History {
    constructor(JSONHistoryItem) {
        this.description = JSONHistoryItem.description;
        this.threatsIDs = [];
        this.alerts = [];

        this.citiesNames = [];
        this.areasNames = [];
        
        JSONHistoryItem["alerts"].forEach(alert=>{
            var timestamp = alert.time;
            var threatID = alert.threat;
            if (!this.threatsIDs.includes(threatID)) this.threatsIDs.push(threatID);

            var cities = [];
            alert.cities.forEach(cityValue => {
                var city = new City(cityValue, threatID, timestamp);
                cities.push(city);
                
                this.citiesNames.push(city.getLocalizationCityName());

                var areaName = new Area(city.areaID, cityValue).getLocalizationAreaName();
                if (!this.areasNames.includes(areaName)) this.areasNames.push(areaName);
            });
            
            this.alerts.push(new Alert(timestamp, cities, threatID));
        });
    }

    getDate() {return (this.alerts.length > 0) ? Preferences.timeConverter(this.alerts[0].getTimestamp()) : Math.floor(Date.now() / 1000);}

    getAlerts() {return this.alerts;}

    getThreatsIDs() {return this.threatsIDs;}

    getThreatsIconsElements() {
        var icons = document.createElement("div");
        this.threatsIDs.forEach(threatID => {
            var img = document.createElement("img");
            img.setAttribute("threat", threatID);
            img.setAttribute("src", "threats_icons/type" + threatID + "." + ((threatID == 0) ? "png" : "svg"));
            icons.appendChild(img);
        });
        return icons;
    }

    getCitiesNames() {return this.citiesNames;}
    getAreasNames() {return this.areasNames;}

    getDescription() {return this.description;}
}