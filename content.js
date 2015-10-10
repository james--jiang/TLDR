/**  
	The "Content Script" that interacts with the webpage and gets the data.
	Send a message containing the page details back to the event 
		caller in events.js -> getPageDetails.
**/
chrome.runtime.sendMessage({
    'title': document.title,
    'url': window.location.href,

    // Below for summarizing the highlighted section
    'summary': window.getSelection().toString()
    //'summary': document.body.innerText.toString()
});