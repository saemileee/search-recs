import * as Type from '../types/searchTypes';

interface TypeCacheInfo {
    data: Type.searchRec[] | [] | undefined;
    expireTime: number | undefined;
    createdAt: number | undefined;
}

class Child {
    value: string;
    data: Type.searchRec[] | [] | undefined;
    expireTime: number | undefined;
    createdAt: number | undefined;
    children: Map<string, any>;

    constructor(
        value = '',
        cacheInfo: TypeCacheInfo = {data: undefined, expireTime: undefined, createdAt: undefined}
    ) {
        const {data, expireTime, createdAt} = cacheInfo;
        this.value = value;
        this.data = data;
        this.expireTime = expireTime;
        this.createdAt = createdAt;
        this.children = new Map();
    }
}

class Trie {
    root: Child;
    constructor() {
        this.root = new Child();
    }

    insert(
        string: string,
        cacheInfo: {
            data: Type.searchRec[] | [] | undefined;
            expireTime: number | undefined;
        }
    ) {
        const {data, expireTime} = cacheInfo;

        let currentNode = this.root;

        for (let i = 0; i < string.length; i++) {
            const char = string[i];
            // 현재 노드 하위 노드에 해당 음절이 없다면 음절추가하기
            if (!currentNode.children.has(char)) {
                // 마지막 음절 전까지는 음절만 추가하기
                if (i < string.length - 1) {
                    currentNode.children.set(char, new Child(currentNode.value + char));
                }
                // 마지막 음절 (전체 쿼리키 값에 데이터 추가하기)
                else {
                    currentNode.children.set(
                        char,
                        new Child(currentNode.value + char, {
                            data,
                            expireTime,
                            createdAt: new Date().getTime(),
                        })
                    );
                }
            }

            currentNode = currentNode.children.get(char);
        }
    }

    getMostSimilar(string: string) {
        let currentNode = this.root;

        for (const char of string) {
            if (!currentNode.children.has(char)) {
                return currentNode;
            }
            currentNode = currentNode.children.get(char);
        }
        return currentNode;
    }

    getCacheData(string: string) {
        const similarNode = this.getMostSimilar(string);
        if (similarNode.value === '') {
            return false;
        }

        if (similarNode.data === undefined) {
            return false;
        }

        if (similarNode.data) {
            if (
                new Date().getTime() - (similarNode.createdAt || 0) >
                (similarNode.expireTime || -1)
            ) {
                return false;
            } else {
                const newData = similarNode.data.filter(rec => rec.sickNm.includes(string));
                this.insert(string, {data: newData, expireTime: similarNode.expireTime});
                return newData;
            }
        }

        return false;
    }
}

export const searchTrieCache = new Trie();
