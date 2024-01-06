class Store {
    getPinnedTabs() {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({
                pinned: true,
                currentWindow: true
            }, (tabs) => {
                resolve(tabs || [])
            });
        })
    }

    change(record, data) {
        return new Promise((resolve, reject) => {
            this.find()
                .then((records) => {
                    records.forEach((record, i) => {
                        if (record.id === data.id) {
                            records[i] = data
                        }
                    });
                    this.save(records).then(() => {
                        resolve(records)
                    })
                });
        })
    }

    add(record) {
        return new Promise((resolve, reject) => {
            this.find()
                .then((records) => {
                    record.id = record.id || `${record.name || 'default'}_${new Date().getTime()}_${Math.random()}`
                    records.push(record);
                    this.save(records).then(() => {
                        resolve(records)
                    })
                });
        })
    }

    save(records = []) {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({'pinned_records': records}, (result = {}) => {
                resolve(result.pinned_records || [])
            })
        })
    }

    remove(record) {
        return new Promise((resolve, reject) => {
            this.find()
                .then((records) => {
                    const index = records.findIndex((obj) => {
                        return obj.id === record.id;
                    });
                    if (index >= 0) {
                        records.splice(index, 1);
                    }
                    this.save(records)
                        .then(() => {
                            resolve(records);
                        })
                });
        })
    }

    clean() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.set({'pinned_records': []}, (result = {}) => {
                console.log('find', result.pinned_records);
                resolve(result.pinned_records || [])
            })
        })
    }

    find() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('pinned_records', (result = {}) => {
                console.log('find', result.pinned_records);
                resolve(result.pinned_records || [])
            })
        })
    }
}