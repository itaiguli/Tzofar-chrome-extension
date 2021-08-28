var contentScript = true;
var iframe;

async function showPopup() {
    const alertsOverSites = await new Promise((resolve, reject) => chrome.storage.sync.get({ 'alertsOverSites': true }, value => resolve(value.alertsOverSites)));
    if (iframe || !alertsOverSites) return;

    // Create new iframe element.
    iframe = document.createElement('iframe'); 
    iframe.style.height = "230px";
    iframe.style.width = "680px";
    iframe.style.position = "fixed";
    iframe.style.bottom = "20px";
    iframe.style.left = "20px";
    iframe.style.zIndex = "9000000000000000000";
    iframe.style.borderRadius = "15px";
    iframe.style.boxShadow = "0 0 20px rgb(0 0 0 / 30%)";
    iframe.style.border = "none"; 
    iframe.src = chrome.extension.getURL("alert.html");
    document.body.appendChild(iframe);
}

function closePopup() {
    if (!iframe) return;
    
    // Delete iframe element.
    document.body.removeChild(iframe);
    iframe = null;
}

// Listen for alerts
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.hasOwnProperty('cities')) {
        (!data.cities.length) ? closePopup() : showPopup();
    } 
    else if (data == 'contentScript') {
        sendResponse(true);
    }
});

// On load, get current cities from background service
chrome.runtime.sendMessage('currentCities', (currentCities) => { if (currentCities.length > 0) showPopup() });