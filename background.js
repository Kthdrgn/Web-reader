// redirect ebooks to our reader
const redirector = (data) => {
    // TODO: check if application/epub+zip
    const rdURL = chrome.runtime.getURL("reader.html") + "?src=" + encodeURIComponent(data.url);
    return { redirectUrl: rdURL }
}

chrome.webRequest.onBeforeRequest.addListener(redirector,
    {
        // TODO: mobi, etc.
        // FIXME: fails to match file:// in Firefox
        "urls": ["*://*/*.epub", "*://*/*.EPUB", "file://*/*.epub", "file://*/*.EPUB"],
        "types": ["main_frame"], // our own requests mustn't redirect to the reader page
    },
    ['blocking']
);

// TODO: explore using downloads API to cancel files with relevant extensions and re-fetch them in browser
// this would allow opening files where urls don't include file extensions