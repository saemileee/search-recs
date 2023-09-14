import {useCallback, useReducer} from 'react';
import * as Fetcher from '../../apis/search';
import * as Type from '../../types/searchTypes';
import axios, {AxiosError} from 'axios';
import {TrieCache} from '../../utils/trieCache';
import {searchCacheStorage} from '../../store/cacheStorage';

interface TypeSearchState {
    isLoading: boolean;
    error: null | AxiosError;
    data: string[];
}

type TypeAction =
    | {type: 'GET'; payload: string[]}
    | {type: 'ERROR'; payload: AxiosError}
    | {type: 'FETCHING'}
    | {type: 'INIT'};

const initState = {
    isLoading: true,
    error: null,
    data: [],
};

const reducer = (state: TypeSearchState, action: TypeAction) => {
    switch (action.type) {
        case 'GET': {
            const slicedData = action.payload.slice(0, MAX_RECS_LENGTH);
            return {...state, isLoading: false, data: slicedData};
        }
        case 'ERROR':
            return {...state, isLoading: false, error: action.payload};
        case 'FETCHING':
            return {...state, isLoading: true, error: null};
        case 'INIT':
            return initState;
        default:
            return state;
    }
};

const MAX_RECS_LENGTH = 7;

const searchTrieCache = new TrieCache(searchCacheStorage);

const useSearch = () => {
    const [state, dispatch] = useReducer(reducer, initState);
    const {data, isLoading, error} = state;

    const getSearchRecs = useCallback(async (queryKey: string, expireTime: number) => {
        dispatch({type: 'FETCHING'});

        const cachedData = searchTrieCache.getCacheData(queryKey);
        if (cachedData) {
            dispatch({type: 'GET', payload: cachedData});
        } else {
            try {
                const res = await Fetcher.getSearchRecs(queryKey);
                const recs = res.data.map((data: Type.searchRec) => data.sickNm);
                searchTrieCache.insertCache(queryKey, {
                    data: recs,
                    expireTime,
                });
                dispatch({type: 'GET', payload: recs});
            } catch (e) {
                if (axios.isAxiosError(e)) {
                    dispatch({type: 'ERROR', payload: e});
                } else {
                    console.error(e);
                }
            }
        }
    }, []);

    const initSearchRecs = useCallback(() => {
        dispatch({type: 'INIT'});
    }, []);

    return {data, isLoading, error, getSearchRecs, initSearchRecs};
};

export default useSearch;
