import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import useSearchQuery from '../hooks/useSearch';
import useDebounce from '../hooks/useDebounce';

const DEBOUNCING_TIME = 500;

const MainContainer = () => {
    const debounce = useDebounce();
    const searchInput = useRef(null);

    const [typedSearchKeyword, setTypedSearchKeyword] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [focusingIdx, setFocusingIdx] = useState<number | null>(null);

    const {isLoading, data: recs, getSearchRecs} = useSearchQuery();
    const searchKeyword =
        recs.length > 0 && focusingIdx !== null ? recs[focusingIdx].sickNm : typedSearchKeyword;

    const handleTypeKeyword = (char: string) => {
        setFocusingIdx(null);
        setTypedSearchKeyword(char);
        if (char.length) {
            debounce(() => char.length && getSearchRecs(char, 10000), DEBOUNCING_TIME);
        }
    };

    const activateSearch = () => {
        setIsSearchActive(true);
    };

    const changeFocusingIdx = (key: string) => {
        if (key === 'ArrowDown') {
            if (focusingIdx === null) {
                setFocusingIdx(0);
            } else if (focusingIdx < recs.length - 1) {
                setFocusingIdx(prev => (prev !== null ? prev + 1 : prev));
            }
        }
        if (key === 'ArrowUp') {
            if (focusingIdx === 0) {
                setFocusingIdx(null);
            } else if (focusingIdx !== null && focusingIdx > 0) {
                setFocusingIdx(prev => (prev ? prev - 1 : prev));
            }
        }
    };

    const handleOnSubmit = (searchKeyword: string) => {
        alert(searchKeyword);
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
                        if (e.key === 'Enter') return handleOnSubmit(searchKeyword);
                        changeFocusingIdx(e.key);
                    }}
                    onFocus={activateSearch}
                    placeholder='질환명을 입력해 주세요.'
                />
                {isSearchActive && <button>x</button>}
                <button type='submit' onClick={() => handleOnSubmit(typedSearchKeyword)}>
                    Search
                </button>
            </div>
            {isSearchActive && (
                <div>
                    <ul>
                        {isLoading && typedSearchKeyword.length ? (
                            <li>검색 중...</li>
                        ) : (
                            recs.length > 0 && (
                                <React.Fragment>
                                    <label>추천 검색어</label>
                                    {recs.map((data, idx) => (
                                        <KeywordStyled
                                            className={focusingIdx === idx ? 'focused' : ''}
                                            key={data.sickCd}
                                            onMouseOver={() => setFocusingIdx(idx)}
                                            onClick={() => handleOnSubmit(searchKeyword)}
                                        >
                                            {data.sickNm}
                                        </KeywordStyled>
                                    ))}
                                </React.Fragment>
                            )
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

const KeywordStyled = styled.li`
    &.focused {
        background-color: blue;
    }
    cursor: pointer;
`;

export default MainContainer;
