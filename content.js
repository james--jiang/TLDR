// Send a message containing the page details back to the event page
chrome.runtime.sendMessage({
    'title': document.title,
    'url': window.location.href,

    // Below for summarizing the highlighted section
    'summary': window.getSelection().toString()
    //'summary': document.body.innerText.toString()
});