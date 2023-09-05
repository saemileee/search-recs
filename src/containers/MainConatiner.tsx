import React, {useState} from 'react';
import * as Fetcher from '../apis/search';
import * as Type from '../types/searchTypes';

const MainContainer = () => {
    const [searchChar, setSearchChar] = useState('');
    const [recs, setRecs] = useState<Type.searchRecs>([]);
    const [isLoading, setIsLoading] = useState(searchChar.length ? true : false);

    const getSearchRecs = async (char: string) => {
        try {
            const data = await Fetcher.getSearchRecs(char);
            setRecs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTypeKeyword = (char: string) => {
        setSearchChar(char);
        getSearchRecs(char);
    };

    return (
        <>
            <h1>
                국내 모든 임상시험 검색하고
                <br />
                온라인으로 참여하기
            </h1>
            <div>
                <input
                    type='text'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTypeKeyword(e.target.value)
                    }
                    placeholder='질환명을 입력해 주세요.'
                />
                <button>Search</button>
            </div>
            <ul>
                {isLoading && <li>검색 중...</li>}
                {searchChar.length > 0 && <li>{searchChar}</li>}
                <label>추천 검색어</label>
                {recs.length > 0 && recs.map((data, idx) => idx < 7 && <li>{data.sickNm}</li>)}
            </ul>
        </>
    );
};

export default MainContainer;
