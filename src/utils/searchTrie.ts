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
        const lowerCaseString = string.toLowerCase();
        console.info('캐싱 됨');

        for (let i = 0; i < lowerCaseString.length; i++) {
            const char = lowerCaseString[i];

            const isChildrenNotHavingChar = !currentNode.children.has(char);
            const isBeforeLastChar = i < lowerCaseString.length - 1;
            const isLastChar = i === lowerCaseString.length - 1;

            if (isChildrenNotHavingChar && isBeforeLastChar) {
                currentNode.children.set(char, new Child(currentNode.value + char));
            }

            if (isLastChar) {
                currentNode.children.set(
                    char,
                    new Child(currentNode.value + char, {
                        data,
                        expireTime,
                        createdAt: new Date().getTime(),
                    })
                );
            }

            currentNode = currentNode.children.get(char);
        }
    }

    getMostSimilar(string: string) {
        let currentNode = this.root;
        const lowerCaseString = string.toLowerCase();

        for (const char of lowerCaseString) {
            if (!currentNode.children.has(char)) {
                return currentNode;
            }
            currentNode = currentNode.children.get(char);
        }
        return currentNode;
    }

    getCacheData(string: string) {
        const lowerCaseString = string.toLowerCase();
        const similarNode = this.getMostSimilar(lowerCaseString);
        const similarData = similarNode.data;

        const isNothingSimilar = similarNode.value === '';
        const isSimilarNodeEmpty = similarData === undefined;
        const isSimilarHavingData = similarData;
        const isExpired =
            new Date().getTime() - (similarNode.createdAt || 0) > (similarNode.expireTime || 1);
        const isSameNodeValue = similarNode.value === lowerCaseString;

        if (isNothingSimilar) {
            return false;
        }

        if (isSimilarNodeEmpty) {
            return false;
        }

        if (isSimilarHavingData) {
            if (isExpired) {
                console.info('캐시 만료');
                return false;
            } else {
                if (isSameNodeValue) {
                    return similarNode.data;
                }
                const newData = similarData.filter(rec =>
                    rec.sickNm.toLowerCase().includes(lowerCaseString)
                );

                this.insert(lowerCaseString, {data: newData, expireTime: similarNode.expireTime});

                return newData;
            }
        }

        return false;
    }
}

export const searchTrieCache = new Trie();
