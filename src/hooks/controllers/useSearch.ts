import {useCallback, useState} from 'react';
import * as Fetcher from '../../apis/search';
import * as Type from '../../types/searchTypes';
import {searchTrieCache} from '../../store/searchCache';

const MAX_RECS_LENGTH = 7;
const useSearch = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<Type.searchRec[]>([]);

    const getSearchRecs = useCallback((queryKey: string, expireTime: number) => {
        console.info('패칭 함수 호출 쿼리키: ' + queryKey);

        const fetchData = async () => {
            try {
                const res = await Fetcher.getSearchRecs(queryKey);

                searchTrieCache.insert(queryKey, {data: res.data, expireTime});

                const slicedData = res.data.slice(0, MAX_RECS_LENGTH);
                setData(slicedData);
            } catch (e) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };

        const cacheData = searchTrieCache.getCacheData(queryKey);
        if (cacheData) {
            console.info('저장된 쿼리키 있음, 캐시된 전체 데이터: ');
            console.info(cacheData);

            const slicedData = cacheData.slice(0, MAX_RECS_LENGTH);
            setData(slicedData);
            setIsLoading(false);
        } else {
            console.info('캐싱된 데이터가 없어 api 호출');
            fetchData();
        }
    }, []);

    return {data, isLoading, error, getSearchRecs};
};

export default useSearch;
