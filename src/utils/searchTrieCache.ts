import * as Type from '../types/searchTypes';

type TypeCacheData = Type.searchRec[] | [] | undefined;
type TypeExpireTime = number | undefined;
type TypeCreatedAt = number | undefined;

interface TypeCacheInfo {
    data: TypeCacheData;
    expireTime: TypeExpireTime;
    createdAt?: TypeCreatedAt;
}

interface TypeChild {
    value: string;
    data?: TypeCacheData;
    expireTime?: TypeExpireTime;
    createdAt?: TypeCreatedAt;
    children?: TypeNode;
}

interface TypeNode {
    [key: string]:
        | {
              value: string;
              data: TypeCacheData;
              expireTime: TypeExpireTime;
              createdAt: TypeCreatedAt;
              children: TypeNode;
          }
        | undefined;
}

const initState = {
    root: {value: '', data: undefined, expireTime: undefined, createdAt: undefined, children: {}},
};

const getNewNode = (
    value: string,
    data: TypeCacheData = undefined,
    expireTime: TypeExpireTime = undefined,
    createdAt: TypeCreatedAt = undefined
) => {
    return {
        value: value,
        data,
        expireTime,
        createdAt,
        children: {},
    };
};

localStorage.setItem('searchCache', JSON.stringify(initState));

const getCurrentTime = () => {
    return new Date().getTime();
};

export const isExpired = (cacheDataInfo: TypeChild) => {
    const {createdAt, expireTime} = cacheDataInfo;
    const currentTime = getCurrentTime();
    if (currentTime - createdAt! > expireTime!) return true;
    return false;
};

export const insertCache = (string: string, cacheInfo: TypeCacheInfo) => {
    console.info('cache insert');
    const {data, expireTime} = cacheInfo;
    const newCache = JSON.parse(localStorage.getItem('searchCache')!);
    let currentNode = newCache.root;
    const lowerCaseString = string.toLowerCase();

    for (let i = 0; i < lowerCaseString.length; i++) {
        const char = lowerCaseString[i];
        const isChildrenNotHavingChar = !currentNode?.children[char];
        const isBeforeLastChar = i < lowerCaseString.length - 1;
        const isLastChar = i === lowerCaseString.length - 1;

        if (isChildrenNotHavingChar && isBeforeLastChar) {
            currentNode.children[char] = getNewNode(currentNode.value + char);
        }

        if (isLastChar) {
            currentNode.children = {
                [char]: getNewNode(
                    currentNode.value + char,
                    data,
                    expireTime,
                    new Date().getTime()
                ),
            };
        }
        currentNode = currentNode?.children[char];
        localStorage.setItem('searchCache', JSON.stringify(newCache));
    }
};

const getMostSimilar = (string: string) => {
    const newCache = JSON.parse(localStorage.getItem('searchCache')!);
    let currentNode = newCache.root;
    const lowerCaseString = string.toLowerCase();

    for (const char of lowerCaseString) {
        if (!currentNode?.children[char]) {
            return currentNode;
        }
        currentNode = currentNode?.children[char];
    }
    return currentNode;
};

export const getCacheData = (string: string) => {
    const lowerCaseString = string.toLowerCase();
    const similarNode = getMostSimilar(lowerCaseString);
    const similarData = similarNode?.data;

    const isNothingSimilar = similarNode?.value === '';
    const isSimilarNodeEmpty = similarData === undefined;
    const isSimilarHavingData = similarData;
    // const isExpired =
    //     new Date().getTime() - (similarNode?.createdAt || 0) > (similarNode?.expireTime || 1);
    const isSameNodeValue = similarNode?.value === lowerCaseString;

    if (isNothingSimilar) {
        return false;
    }

    if (isSimilarNodeEmpty) {
        return false;
    }

    if (isSimilarHavingData) {
        if (isExpired(similarNode)) {
            console.info('캐시 만료');
            return false;
        } else {
            if (isSameNodeValue) {
                return similarNode.data;
            }
            const newData = similarData.filter((rec: any) =>
                rec.sickNm.toLowerCase().includes(lowerCaseString)
            );

            insertCache(lowerCaseString, {data: newData, expireTime: similarNode.expireTime});

            return newData;
        }
    }

    return false;
};
