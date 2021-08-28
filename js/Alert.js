class Alert {
    constructor(timestamp, cities, threatID) {
        this.timestamp = timestamp;
        this.cities = cities;
        this.threatID = threatID;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getCities() {
        return this.cities;
    }

    getThreatID() {
        return this.threatID;
    }
}