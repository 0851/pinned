const store = new Store();

Moon({
    root: "#app",
    view: document.getElementById('app-template').innerHTML,
    records: [],
    name: "",
    loading: false,
    error: false,
    trans: {
        add: chrome.i18n.getMessage('ext_op_add'),
        clean: chrome.i18n.getMessage('ext_op_clean'),
        disable: chrome.i18n.getMessage('ext_op_disable'),
        enable: chrome.i18n.getMessage('ext_op_enable'),
        disabled: chrome.i18n.getMessage('ext_op_disabled'),
        enabled: chrome.i18n.getMessage('ext_op_enabled'),
        del: chrome.i18n.getMessage('ext_op_del'),
    },
    async onCreate() {
        this.update('loading', true);
        this.update('error', false);

        const records = await store.find();

        this.update('loading', false);
        this.update('records', records);
    },
    async keyup(e) {
        if (e.which !== 13) {
            return;
        }
        await this.add();
    },
    async del(record) {
        this.update('loading', true);
        this.update('error', false);

        await store.remove(record);
        const records = await store.find();
        this.update('loading', false);
        this.update('records', records);
    },
    async enabled(record) {
        record.enabled = !record.enabled;
        this.update('loading', true);
        this.update('error', false);

        await store.change(record, record);
        const records = await store.find();
        this.update('loading', false);
        this.update('records', records);
    },
    async clean() {
        this.update('loading', true);
        this.update('error', false);

        const records = await store.clean();
        this.update('loading', false);
        this.update('records', records);
    },
    async add() {
        const name = (this.name || '').trim();
        if (/^\s*$/.test(name)) {
            this.update('error', '名称不能为空');
            return
        }

        this.update('loading', true);
        this.update('error', false);


        const tabs = await store.getPinnedTabs();

        const record = {
            name: this.name,
            enabled: false,
            tabs
        };

        console.log(tabs);
        
        await store.add(record);

        const records = await store.find();

        this.update({
            records,
            name: '',
            loading: false
        });
    }
});