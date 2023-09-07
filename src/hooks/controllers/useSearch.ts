import {useCallback, useReducer} from 'react';
import * as Fetcher from '../../apis/search';
import * as Type from '../../types/searchTypes';
import axios, {AxiosError} from 'axios';
import {insertCache, getCacheData} from '../../utils/searchTrieCache';

interface TypeSearchState {
    isLoading: boolean;
    error: null | AxiosError;
    data: Type.searchRec[];
}

type TypeAction =
    | {type: 'GET'; payload: Type.searchRec[]}
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

const useSearch = () => {
    const [state, dispatch] = useReducer(reducer, initState);
    const {data, isLoading, error} = state;

    const getSearchRecs = useCallback((queryKey: string, expireTime: number) => {
        console.info('패칭 함수 호출 쿼리키: ' + queryKey);
        dispatch({type: 'FETCHING'});

        const fetchData = async () => {
            try {
                const res = await Fetcher.getSearchRecs(queryKey);
                insertCache(queryKey, {data: res.data, expireTime});
                dispatch({type: 'GET', payload: res.data});
            } catch (e) {
                if (axios.isAxiosError(e)) {
                    dispatch({type: 'ERROR', payload: e});
                } else {
                    console.error(e);
                }
            }
        };

        const cachedData = getCacheData(queryKey);
        if (cachedData) {
            console.info('저장된 쿼리키 있음, 캐시된 전체 데이터: ');
            console.info(cachedData);
            dispatch({type: 'GET', payload: cachedData});
        } else {
            console.info('캐싱된 데이터가 없어 api 호출');
            fetchData();
        }
    }, []);

    const initSearchRecs = useCallback(() => {
        dispatch({type: 'INIT'});
    }, []);

    return {data, isLoading, error, getSearchRecs, initSearchRecs};
};

export default useSearch;
