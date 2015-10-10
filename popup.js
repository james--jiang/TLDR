// This callback function is called when the content script has been 
// applied and returned its results.
function onPageDetailsReceived(pageDetails)  { 
    document.getElementById('title').textContent = pageDetails.title; 
    document.getElementById('url').textContent = pageDetails.url; 
    document.getElementById('summary').innerText = pageDetails.summary; 
} 

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {

    // Get the event page/background page
    chrome.runtime.getBackgroundPage(function(eventPage) {

        // Call the getPageInfo function in the event page, passing in 
        // our onPageDetailsReceived function as the callback. This injects 
        // content.js into the current tab's HTML.
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});