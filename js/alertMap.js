var map;
var isMapLoaded = false;
var nowCities = [];

window.addEventListener("load", function(event) {
    // Load google maps script
    loadMapScript();

    // On load page - get current cities from background service
    chrome.runtime.sendMessage('currentCities', (currentCities) => alertsListener(currentCities));

    // Listen to alerts
    chrome.runtime.onMessage.addListener((data) => {
        if (data.hasOwnProperty('cities'))
            (data.cities.length) ? alertsListener(data.cities || []) : window.close();
    });

    document.getElementById("copy").addEventListener("click", () => Preferences.copyAlert());
    document.getElementById("open").addEventListener("click", () => Preferences.launchSiteMap());
});

function loadMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 31.5469501, lng: 34.6863132},
        zoom: 9,
        maxZoom: 13,
        disableDefaultUI: true,
        options: {
            gestureHandling: 'greedy'
        }
    });

    google.maps.event.addListenerOnce(map, 'idle', function() {
        // On map ready listener
        isMapLoaded = true;
        if (nowCities.length) addPolygonsMarkers(nowCities);
    });
}

async function alertsListener(cities) {
    // Convert objects to City objects
    cities = cities.map(city => new City(city.value, city.threat, city.timestamp));
    nowCities = cities;

    // Get elements
    var threatTitle = document.querySelector("#alert h3");
    var citiesDIV = document.querySelector(".cities-container");
    citiesDIV.innerHTML = "";

    // Threats titles
    var threatTitles = [];

    cities.forEach(city => {
        var cityNode = document.createElement("city");
        cityNode.textContent = city.getLocalizationCityName();
        cityNode.addEventListener('click', function(e) {
            if (!map || !city.getPolygon().length) return;

            // Change map center on click
            var bounds = new google.maps.LatLngBounds();
            city.getPolygon().forEach(point => bounds.extend(point));

            if (!bounds.isEmpty()) {
                map.initialZoom = true;
                map.fitBounds(bounds);
            }
        })
        citiesDIV.appendChild(cityNode);
        threatTitles.push(City.getLocalizationThreatTitle(city.getThreatID()));
    })
    threatTitle.textContent = [...new Set(threatTitles)].join(" | ");
    
    // Add polygons & Markers
    if (isMapLoaded) {
        addPolygonsMarkers(cities);
    }
}

var polygons = [];
var markers = [];
var alreadyShowing = [];
function addPolygonsMarkers(cities) {
    // Clear all previous polygons & markers
    polygons.forEach(p=> p.setMap(null));
    markers.forEach(m=> m.setMap(null));
    polygons, markers, alreadyShowing = [];

    var bounds = new google.maps.LatLngBounds();
    cities.forEach(city => {
        if (alreadyShowing.includes(city.id)) return;

        const polygon = city.getPolygon();
        const point = new google.maps.LatLng(city.lat, city.lng);

        if (polygon.length && !polygons.includes()) {
            polygons.push(new google.maps.Polygon({
                paths: polygon,
                strokeColor: "#FF0000",
                strokeOpacity: 0.7,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.30,
                map: map
            }));
            polygon.forEach(point=> bounds.extend(point));
        }
        
        markers.push(new google.maps.Marker({
            position: point,
            icon: {
                url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png",
                scaledSize: new google.maps.Size(20, 33)
            },
            map: map
        }));

        // To not show again..
        alreadyShowing.push(city.id);
    })
    if (bounds.isEmpty()) return;

    map.initialZoom = true;
    map.fitBounds(bounds);
}

async function loadMapScript() {
    // Load google map js
    const siteLanguage = await Preferences.getSelectedLanguage();
    const googleMapsKEY = await Preferences.getGoogleMapsKEY();
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${googleMapsKEY}&v=3.42&language=${siteLanguage == 'HE' ? 'iw' : siteLanguage.toLowerCase()}`);
    document.head.appendChild(scriptTag);

    // Load map after script has been loaded
    scriptTag.addEventListener('load', () => loadMap());
}

function gm_authFailure() {
    // Google Maps KEY not working? Try to load another key from the server.
    // After that, load the map again.
    Preferences.updateGoogleMapsKEY(googleMapsKEY => loadMapScript());
}