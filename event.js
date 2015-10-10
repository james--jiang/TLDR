// Gets the main text, title, and url from the current webpage.
function getPageDetails(callback) { 
    // Apply content script on to the current page.
    chrome.tabs.executeScript(null, { file: 'content.js' }); 

    // Perform the callback (onPageDetailsReceived) when the message is received from the content script.
    // Message is the message containing the page details.
    chrome.runtime.onMessage.addListener(function(message)  { 
        // Call the onPageDetailsReceived function in popup.js .
        callback(message); 
    }); 
}; 
