import {searchCacheStorage} from '../store/cacheStorage';
import * as Type from '../types/searchTypes';

type TypeCacheData = Type.searchRec[] | [] | null;
type TypeExpireTime = number | null;
type TypeCreatedAt = number | null;

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
    [key: string]: {
        value: string;
        data: TypeCacheData;
        expireTime: TypeExpireTime;
        createdAt: TypeCreatedAt;
        children: TypeNode;
    } | null;
}

const initState = {
    root: {value: '', data: null, expireTime: null, createdAt: null, children: {}},
};

const getNewNode = (
    value: string,
    data: TypeCacheData = null,
    expireTime: TypeExpireTime = null,
    createdAt: TypeCreatedAt = null
) => {
    return {
        value: value,
        data,
        expireTime,
        createdAt,
        children: {},
    };
};

const getCurrentTime = () => {
    return new Date().getTime();
};

const getCacheAllData = () => {
    return searchCacheStorage.getItem();
};

export const openCache = () => {
    console.info('cache open');
    const cachedData = getCacheAllData();
    if (cachedData) {
        return;
    }
    return searchCacheStorage.setItem(JSON.stringify(initState));
};

export const isExpired = (cacheDataInfo: TypeChild) => {
    const {createdAt, expireTime} = cacheDataInfo;
    const currentTime = getCurrentTime();
    if (createdAt && expireTime && currentTime - createdAt > expireTime) {
        return true;
    }
    return false;
};

export const insertCache = (string: string, cacheInfo: TypeCacheInfo) => {
    console.info('cache insert');
    const {data, expireTime} = cacheInfo;
    const newCache = JSON.parse(localStorage.getItem('searchCache') || '');
    let currentNode = newCache.root;
    const lowerCaseString = string.toLowerCase();

    for (let i = 0; i < lowerCaseString.length; i++) {
        const char = lowerCaseString[i];
        const isChildrenNotHavingChar = !currentNode?.children[char];
        const isBeforeLastChar = i < lowerCaseString.length - 1;
        const isLastChar = i === lowerCaseString.length - 1;
        const isNeededDeleteData =
            !isLastChar && currentNode.expireTime !== null && isExpired(currentNode);

        if (isNeededDeleteData) {
            currentNode.data = null;
            currentNode.expireTime = null;
            currentNode.createdAt = null;
            console.info(currentNode.value + ' 캐시 만료');
        }

        if (isChildrenNotHavingChar && isBeforeLastChar) {
            currentNode.children[char] = getNewNode(currentNode.value + char);
        }

        if (isLastChar) {
            currentNode.children[char] = getNewNode(
                currentNode.value + char,
                data,
                expireTime,
                getCurrentTime()
            );
        }

        currentNode = currentNode?.children[char];
        searchCacheStorage.setItem(JSON.stringify(newCache));
    }
};

const getMostSimilar = (string: string) => {
    openCache();

    const newCache = searchCacheStorage.getItem();
    let currentNode = newCache.root;
    const lowerCaseString = string.toLowerCase();

    for (const char of lowerCaseString) {
        const isNeededDeleteData = currentNode.expireTime !== null && isExpired(currentNode);

        if (isNeededDeleteData) {
            currentNode.data = null;
            currentNode.expireTime = null;
            currentNode.createdAt = null;
            console.info(currentNode.value + ' 캐시 만료');
        }

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
    const isSimilarNodeEmpty = similarData === null;
    const isSimilarHavingData = similarData;
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
            const newData = similarData.filter((rec: Type.searchRec) =>
                rec.sickNm.toLowerCase().includes(lowerCaseString)
            );

            insertCache(lowerCaseString, {data: newData, expireTime: similarNode.expireTime});

            return newData;
        }
    }

    return false;
};
