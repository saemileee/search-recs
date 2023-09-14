type TypeCacheData = string[] | [] | null;
type TypeExpireTime = number | null;
type TypeCreatedAt = number | null;

interface TypeCacheInfo {
    data: TypeCacheData;
    expireTime: TypeExpireTime;
    createdAt?: TypeCreatedAt;
}

interface InterfaceNode {
    value: string;
    data: TypeCacheData;
    expireTime: TypeExpireTime;
    createdAt: TypeCreatedAt;
    children: InterfaceChild;
}

interface InterfaceChild {
    [key: string]: InterfaceNode;
}

interface InterfaceLocalStorage {
    key: string;
    getItem: () => InterfaceNode;
    setItem: (value: string) => string | undefined;
}

class Node {
    value: string;
    data: TypeCacheData;
    expireTime: TypeExpireTime;
    createdAt: TypeCreatedAt;
    children: InterfaceChild;
    constructor(
        value: string,
        data: TypeCacheData = null,
        expireTime: TypeExpireTime = null,
        createdAt: TypeCreatedAt = null
    ) {
        this.value = value;
        this.data = data;
        this.expireTime = expireTime;
        this.createdAt = createdAt;
        this.children = {};
    }
}

export class TrieCache {
    root: InterfaceNode;
    currentNode: InterfaceNode;
    cacheStorage: InterfaceLocalStorage;
    constructor(cacheStorage: InterfaceLocalStorage) {
        this.cacheStorage = cacheStorage;
        this.root = new Node('');
        this.currentNode = this.root;
    }

    private getCurrentTime() {
        return new Date().getTime();
    }

    private openCache() {
        try {
            const cachedData = this.cacheStorage.getItem();
            if (cachedData) {
                this.root = cachedData;
            } else {
                this.root = this.resetCacheStorage();
            }
        } catch (e) {
            console.error('캐시 스토리지가 비어있습니다. 초기화합니다.');
            this.root = this.resetCacheStorage();
        }
    }

    private resetCacheStorage() {
        this.cacheStorage.setItem(JSON.stringify({...new Node('')}));
        const resetData = this.cacheStorage.getItem();
        this.root = resetData;
        return resetData;
    }

    private initCacheStorage() {
        const initData = this.root;
        if (initData) {
            this.cacheStorage.setItem(JSON.stringify(initData));
        } else {
            this.resetCacheStorage();
        }
    }

    private isExpired = (cacheInfo: InterfaceNode) => {
        try {
            const {createdAt, expireTime} = cacheInfo;
            const currentTime = this.getCurrentTime();
            if (createdAt && expireTime && currentTime - createdAt > expireTime) {
                return true;
            }
            return false;
        } catch (e) {
            console.error('만료 시간을 체크할 수 없습니다. 스토리지를 다시 오픈합니다.');
            this.initCacheStorage();
        }
    };

    private addChild(key: string, node: Node) {
        // 인자로 받은 Node는 Node{...} 로 들어오기 때문에 스프레드 연산자 써야함
        this.currentNode.children[key] = {...node};
    }

    private getMostSimilarCache(string: string) {
        try {
            this.openCache();
            // currentNode를 캐시스토리지에서 가져온 루트로 초기화
            this.currentNode = this.root;
            let mostSimilarNode = this.currentNode;

            for (let i = 0; i < string.length; i++) {
                const char = string[i];
                if (char in this.currentNode.children) {
                    this.currentNode = this.currentNode.children[char];

                    const isNeededDeleteData = this.isExpired(this.currentNode);
                    // 현재 노드의 캐시 만료되었다면 데이터 삭제
                    if (isNeededDeleteData) {
                        this.currentNode = {
                            ...this.currentNode,
                            data: null,
                            expireTime: null,
                            createdAt: null,
                        };
                        this.cacheStorage.setItem(JSON.stringify(this.root));
                    }

                    // 현재 노드에 데이터가 있다면 mostSimilarNode 업데이트
                    if (this.currentNode.data) {
                        mostSimilarNode = this.currentNode;
                    }
                } else {
                    // currentNode.children에 현재 문자열이 없다면 현재 노드가 들어온 string 하고 가장 비슷한 노드임
                    // 데이터가 있는 노드를 반환
                    return mostSimilarNode;
                }
            }

            return mostSimilarNode;
        } catch (e) {
            console.info('에러');
            this.initCacheStorage();
        }
    }

    // 이건 가장 비슷한 캐시를 찾고 다시 인서트할 때 사용함
    insertCache(string: string, cacheInfo: TypeCacheInfo) {
        const {data, expireTime} = cacheInfo;
        const startIdx = this.currentNode.value.length;

        // currentNode는 getSimilar 를 순회한 마지막 노드이기 때문에 startIdx는 비슷한 노드의 value 길이 다음부터 체크하면 됨
        for (let i = startIdx; i < string.length; i++) {
            const char = string[i];
            const charNeedsAddData = i === string.length - 1;
            const newValue = this.currentNode.value + char;

            if (charNeedsAddData) {
                this.addChild(char, new Node(newValue, data, expireTime, this.getCurrentTime()));
            } else {
                this.addChild(char, new Node(newValue));
                this.currentNode = this.currentNode.children[char];
            }
        }
        this.cacheStorage.setItem(JSON.stringify(this.root));
    }

    getCacheData(string: string) {
        const lowerCaseString = string.toLowerCase();
        const similarNode = this.getMostSimilarCache(lowerCaseString);
        const similarData = similarNode?.data;

        const similarHasData = similarData;
        const similarValueIsSameWString = similarNode?.value === lowerCaseString;

        if (similarHasData) {
            if (similarValueIsSameWString) {
                return similarData;
            } else {
                const newData = similarData.filter(data =>
                    data.toLowerCase().includes(lowerCaseString)
                );
                const cacheInfo = {data: newData, expireTime: similarNode.expireTime};

                this.insertCache(lowerCaseString, cacheInfo);

                return newData;
            }
        }
        this.currentNode = this.root;
        return false;
    }
}
