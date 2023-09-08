export class LocalStorage {
    key: string;
    constructor(key: string) {
        this.key = key;
    }

    getItem() {
        try {
            return JSON.parse(localStorage.getItem(this.key)!);
        } catch (e) {
            console.error('로컬 스토리지 사용자 임의 조작');
            this.setItem('');
        }
    }

    setItem(value: string) {
        try {
            return JSON.stringify(localStorage.setItem(this.key, value));
        } catch (e) {
            console.error('로컬 스토리지 사용자 임의 조작');
            this.setItem('');
        }
    }
}
