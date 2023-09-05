import {useCallback, useState} from 'react';
import {useRecoilState} from 'recoil';
import {cacheData} from '../store/cacheAtom';
import * as Fetcher from '../apis/search';
import * as Type from '../types/searchTypes';

const MAX_RECS_LENGTH = 7;
const useSearch = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<Type.searchRec[]>([]);
    const [cache, setCache] = useRecoilState(cacheData);

    const getSearchRecs = useCallback(
        (queryKey: string, expireTime: number) => {
            const nowTime = new Date().getTime();

            const fetchData = async () => {
                try {
                    const res = await Fetcher.getSearchRecs(queryKey);
                    const splicedData = res.data.splice(0, MAX_RECS_LENGTH);
                    setData(splicedData);
                    setCache(
                        cache.set(queryKey, {
                            createdAt: nowTime,
                            expireTime,
                            data: res.data,
                        })
                    );
                } catch (e) {
                    setError(e);
                } finally {
                    setIsLoading(false);
                }
            };

            if (cache.has(queryKey)) {
                const cached = cache.get(queryKey);

                const {data, createdAt, expireTime} = cached!;

                if (nowTime - createdAt < expireTime) {
                    const splicedData = data.splice(0, MAX_RECS_LENGTH);
                    setData(splicedData);
                    setIsLoading(false);
                } else {
                    fetchData();
                }
            } else {
                fetchData();
            }
        },
        [cache, setCache]
    );

    return {data, isLoading, error, getSearchRecs};
};

export default useSearch;
