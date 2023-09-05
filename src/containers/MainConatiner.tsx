import React, {useEffect, useRef, useState} from 'react';
import * as Fetcher from '../apis/search';
import * as Type from '../types/searchTypes';
import styled from 'styled-components';

const MAX_RECS_LENGTH = 7;
const MainContainer = () => {
    const searchInput = useRef(null);

    const [searchChar, setSearchChar] = useState('');
    const [recs, setRecs] = useState<Type.searchRecs>([]);
    const [isLoading, setIsLoading] = useState(searchChar.length ? true : false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [focusingIdx, setFocusingIdx] = useState(0);

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
        setFocusingIdx(0);
        setSearchChar(char);
        if (char.length) {
            getSearchRecs(char);
        }
    };

    const activateSearch = () => {
        setIsSearchActive(true);
    };

    const changeFocusingIdx = (key: string) => {
        if (
            key === 'ArrowDown' &&
            focusingIdx < (MAX_RECS_LENGTH < recs.length ? MAX_RECS_LENGTH : recs.length)
        ) {
            setFocusingIdx(prev => prev + 1);
        }
        if (key === 'ArrowUp' && focusingIdx > 0) {
            setFocusingIdx(prev => prev - 1);
        }
    };

    useEffect(() => {
        const inactivateSearch = (doc: EventTarget | null) => {
            if (doc !== searchInput.current) {
                setIsSearchActive(false);
                setFocusingIdx(0);
            }
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
                    onKeyDown={e => {
                        if (e.nativeEvent.isComposing) return;
                        changeFocusingIdx(e.key);
                    }}
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
                                        idx < MAX_RECS_LENGTH && (
                                            <RecKeywordStyled
                                                className={focusingIdx === idx + 1 ? 'focused' : ''}
                                                key={data.sickCd}
                                            >
                                                {data.sickNm}
                                            </RecKeywordStyled>
                                        )
                                )}
                            </React.Fragment>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

const RecKeywordStyled = styled.li`
    &.focused {
        background-color: blue;
    }
`;

export default MainContainer;
