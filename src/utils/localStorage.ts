export class LocalStorage {
    key: string;
    constructor(key: string) {
        this.key = key;
    }

    getItem() {
        try {
            return JSON.parse(localStorage.getItem(this.key)!);
        } catch (e) {
            console.error('파싱될 수 없는 value 값입니다. 스토리지를 다시 오픈합니다.');
            this.setItem('');
        }
    }

    setItem(value: string) {
        try {
            return JSON.stringify(localStorage.setItem(this.key, value));
        } catch (e) {
            console.error('value 값 입니다. 스토리지를 다시 오픈합니다.');
            this.setItem('');
        }
    }
}
