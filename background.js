let hasTabWithVideoTimer = 0;

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'notification') {
        chrome.notifications.create("float-video", {
            "type": "basic",
            "title": "FloatVideo",
            "message": request.message,
            "iconUrl": chrome.runtime.getURL("assets/icon_48.png")
        });
    }
});

chrome.browserAction.onClicked.addListener( () => {
    let tabsWithVideo = [];

    chrome.tabs.query({ currentWindow: true, status: 'complete' }, tabs => {
        for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.executeScript(tabs[i].id, {
                'file': 'resolvers/hasVideo.js'
            }, j => {
                if (j && j.length && j[0]) {
                    tabsWithVideo.push(tabs[i]);
                }
                let err = chrome.runtime.lastError;
            });
        }
    });

    hasTabWithVideoTimer = setTimeout(() => {
        let tabs = [...tabsWithVideo].sort((a, b) => a.index > b.index ? 1 : -1);

        for (let i = 0; i < tabs.length; i++) {
            if (i === 0) {
                chrome.tabs.executeScript(tabs[i].id, { 'file': 'resolvers/floatVideo.js' });
            } else {
                chrome.tabs.executeScript(tabs[i].id, { 'file': 'resolvers/pauseVideo.js' });
            }
            hasTabWithVideoTimer = 0;
        }
        clearTimeout(hasTabWithVideoTimer);
    }, 1000);
});
