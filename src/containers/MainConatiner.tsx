import React, {useEffect, useRef, useState} from 'react';
import * as Fetcher from '../apis/search';
import * as Type from '../types/searchTypes';

const MainContainer = () => {
    const searchInput = useRef(null);

    const [searchChar, setSearchChar] = useState('');
    const [recs, setRecs] = useState<Type.searchRecs>([]);
    const [isLoading, setIsLoading] = useState(searchChar.length ? true : false);
    const [isSearchActive, setIsSearchActive] = useState(false);

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
        if (char.length) {
            getSearchRecs(char);
        }
    };

    const activateSearch = () => {
        setIsSearchActive(true);
    };

    useEffect(() => {
        const inactivateSearch = (doc: EventTarget | null) => {
            if (doc !== searchInput.current) return setIsSearchActive(false);
        };

        document.addEventListener('click', e => {
            inactivateSearch(e.target);
        });

        return document.removeEventListener('click', e => {
            inactivateSearch(e.target);
        });
    }, []);

    return (
        <>
            <h1>
                국내 모든 임상시험 검색하고
                <br />
                온라인으로 참여하기
            </h1>
            <div>
                <input
                    ref={searchInput}
                    type='text'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleTypeKeyword(e.target.value)
                    }
                    onFocus={activateSearch}
                    placeholder='질환명을 입력해 주세요.'
                />
                {isSearchActive && <button>x</button>} <button>Search</button>
            </div>
            {isSearchActive && (
                <div>
                    <ul>
                        {isLoading && <li>검색 중...</li>}
                        {searchChar.length > 0 && <li>{searchChar}</li>}
                        {recs.length > 0 && (
                            <React.Fragment>
                                <label>추천 검색어</label>
                                {recs.map(
                                    (data, idx) =>
                                        idx < 7 && <li key={data.sickCd}>{data.sickNm}</li>
                                )}
                            </React.Fragment>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

export default MainContainer;
