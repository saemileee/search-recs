import {useEffect} from 'react';
import * as Fetcher from '../apis/search';

const MainContainer = () => {
    useEffect(() => {
        const getSearchRecs = async () => {
            const data = await Fetcher.getSearchRecs('');
            console.info(data);
        };
        getSearchRecs();
    }, []);
    return (
        <>
            <h1>
                국내 모든 임상시험 검색하고
                <br />
                온라인으로 참여하기
            </h1>
            <div>
                <input type='text' />
                <button>Search</button>
            </div>
        </>
    );
};

export default MainContainer;
