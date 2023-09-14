type TypeCacheData = string[] | [] | null;
type TypeExpireTime = number | null;
type TypeCreatedAt = number | null;

interface TypeCacheInfo {
    data: TypeCacheData;
    expireTime: TypeExpireTime;
    createdAt?: TypeCreatedAt;
}

export interface InterfaceNode {
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
    setItem: (value: InterfaceNode) => void;
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
    private root: InterfaceNode;
    private currentNode: InterfaceNode;
    private cacheStorage: InterfaceLocalStorage;
    constructor(cacheStorage: InterfaceLocalStorage) {
        this.cacheStorage = cacheStorage;
        this.root = new Node('');
        this.currentNode = this.root;
    }

    private openCache() {
        try {
            const cachedData = this.cacheStorage.getItem();
            if (cachedData) {
                this.root = cachedData;
            } else {
                this.initCacheStorage();
            }
        } catch (e) {
            console.error('캐시 스토리지가 비어있습니다. 초기화합니다.');
            this.resetCacheStorage();
        }
    }

    private initCacheStorage() {
        const initData = this.root;
        if (initData) {
            this.cacheStorage.setItem(initData);
        } else {
            this.resetCacheStorage();
        }
    }

    private resetCacheStorage() {
        this.cacheStorage.setItem({...new Node('')});
        const resetData = this.cacheStorage.getItem();
        this.root = resetData;
    }

    private getCurrentTime() {
        return new Date().getTime();
    }

    private isExpired(cacheInfo: InterfaceNode) {
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
    }

    private addChild(key: string, node: Node) {
        // 인자로 받은 Node는 Node{...} 로 들어오기 때문에 스프레드 연산자로 객체 형태로 변환
        this.currentNode.children[key] = {...node};
    }

    private getCommonPrefixCache(searchKey: string) {
        try {
            // 가장 먼저 동작하는 메소드이기 때문에 cache를 오픈함
            this.openCache();
            // currentNode를 캐시스토리지에서 가져온 루트로 초기화
            this.currentNode = this.root;
            let mostSimilarNode = this.currentNode;

            // 문자열을 순회하며 노드 체크
            for (let i = 0; i < searchKey.length; i++) {
                const char = searchKey[i];

                // 현재 노드의 children에 이미 문자열이 저장되어 있는 경우
                if (char in this.currentNode.children) {
                    this.currentNode = this.currentNode.children[char];

                    // 노드 순회 중 만료된 캐시를 본다면 삭제 (가비지 컬렉팅)
                    const currentCacheIsExpired =
                        this.currentNode.expireTime !== null && this.isExpired(this.currentNode);
                    if (currentCacheIsExpired) {
                        this.currentNode = {
                            ...this.currentNode,
                            data: null,
                            expireTime: null,
                            createdAt: null,
                        };
                        this.initCacheStorage();
                    }

                    // 현재 노드에 데이터가 있다면 mostSimilarNode 업데이트
                    // 현재 노드가 있지만 데이터가 없는 경우는 가비지 컬렉팅 당한 경우 혹은 중간 문자열으로 검색이 안된 경우임
                    // 따라서 문자열 마지막까지 순회하며 mostSimilarNode를 찾아야함
                    if (this.currentNode.data) {
                        mostSimilarNode = this.currentNode;
                    }
                } else {
                    // currentNode.children에 현재 문자열이 없다면 현재 노드가 새로 검색한 string 하고 가장 비슷한 노드임
                    return mostSimilarNode;
                }
            }

            return mostSimilarNode;
        } catch (e) {
            console.error('순회가 불가한 구조입니다. 캐시 스토리지를 초기화합니다.');
            this.resetCacheStorage();
        }
    }

    insertCache(searchKey: string, cacheInfo: TypeCacheInfo) {
        const {data, expireTime} = cacheInfo;

        // currentNode는 getSimilar를 순회한 후 마지막 노드이기 때문에 startIdx는 비슷한 노드의 value 길이 다음 부터 체크하면 됨
        const startIdx = this.currentNode.value.length;

        for (let i = startIdx; i < searchKey.length; i++) {
            const char = searchKey[i];
            const newValue = this.currentNode.value + char;

            // 마지막 문자열에 데이터 추가
            const charNeedsAddData = i === searchKey.length - 1;
            if (charNeedsAddData) {
                this.addChild(char, new Node(newValue, data, expireTime, this.getCurrentTime()));
            } else {
                // 마지막 문자열이 아닌 경우 value 값만 있는 노드 추가
                this.addChild(char, new Node(newValue));
                this.currentNode = this.currentNode.children[char];
            }
        }

        // 업데이트 한 root 노드를 cacheStorage에 업데이트
        this.initCacheStorage();
    }

    getCacheData(searchKey: string) {
        const lowerCaseString = searchKey.toLowerCase();

        // 검색한 문자열의 앞 문자열들로 캐싱된 데이터가 있는지 찾기
        const commonPrefixNode = this.getCommonPrefixCache(lowerCaseString);
        const commonPrefixData = commonPrefixNode?.data;

        // 앞 문자열이 같은 노드에 데이터가 있는 경우
        if (commonPrefixData) {
            // 앞 문자열이 같은 노드의 value 값이 정확히 일치한다면 바로 해당 데이터 반환
            const isPrefixEqual = commonPrefixNode?.value === lowerCaseString;
            if (isPrefixEqual) {
                return commonPrefixData;
            } else {
                // 아니라면 유사 데이터 중 현재 검색한 값과 일치하는 데이터만 찾아서 재캐싱
                const newData = commonPrefixData.filter(data =>
                    data.toLowerCase().includes(lowerCaseString)
                );
                const cacheInfo = {data: newData, expireTime: commonPrefixNode.expireTime};
                this.insertCache(lowerCaseString, cacheInfo);
                return newData;
            }
        }

        // 검색 문자열이 아예 새로운 문자열이라면 false 반환
        // false인 경우 api를 호출하고 insert 메서드 사용하기
        return false;
    }
}
