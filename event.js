// Gets the main text, title, and url from the current webpage.
function getPageDetails(callback) { 
    // Apply content script on to the current page.
    chrome.tabs.executeScript(null, { file: 's_contscrpt.js' });

    // Perform the callback (selectOrWhole) when the message is received from the content script.
    // Message is the message containing the page details.
    chrome.runtime.onMessage.addListener(function(message)  { 
        // Call the onPageDetailsReceived function in popup.js .
        callback(message); 
    }); 
}; 
