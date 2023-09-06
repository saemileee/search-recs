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
            console.info('패칭 함수 호출 쿼리키: ' + queryKey);
            const nowTime = new Date().getTime();

            const fetchData = async () => {
                try {
                    console.info('api 통신' + queryKey);
                    const res = await Fetcher.getSearchRecs(queryKey);

                    const slicedData = res.data.slice(0, MAX_RECS_LENGTH);
                    setData(slicedData);
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
                console.info('저장된 쿼리키 있음, 캐시된 전체 데이터: ');
                console.info(queryKey, cached);

                if (nowTime - createdAt < expireTime) {
                    console.info('캐시 시간이 남아 저장된 데이터 받아오기');

                    const slicedData = data.slice(0, MAX_RECS_LENGTH);
                    setData(slicedData);
                    setIsLoading(false);
                } else {
                    console.info('시간 만료 돼서 api 호출');
                    fetchData();
                }
            } else {
                console.info('쿼리키 없어서 api 호출');
                fetchData();
            }
        },
        [cache, setCache]
    );

    return {data, isLoading, error, getSearchRecs};
};

export default useSearch;
