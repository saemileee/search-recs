export class LocalStorage {
    key: string;
    constructor(key: string) {
        this.key = key;
    }

    getItem() {
        return JSON.parse(localStorage.getItem(this.key) || '');
    }

    setItem(value: string) {
        return JSON.stringify(localStorage.setItem(this.key, value));
    }
}
