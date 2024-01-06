const store = new Store();

async function onCreated() {
    const records = await store.find();
    let tabs = [];
    records.forEach(function (record) {
        if (record.enabled === true) {
            tabs = tabs.concat(record.tabs);
        }
    });
    tabs.forEach(function (tab) {
        chrome.tabs.create({
            pinned: true,
            url: tab.url
        });
    })
}


chrome.windows.onCreated.removeListener(onCreated);
chrome.windows.onCreated.addListener(onCreated);