/**  
	The "Content Script" that interacts with the webpage and gets:
		the whole text as summary.

	Send a message containing the page details back to the event 
		caller in events.js -> getPageDetails.
**/
chrome.runtime.sendMessage({
    'title': document.title,
    'url': window.location.href,
    'summary': document.body.innerText.toString()
});