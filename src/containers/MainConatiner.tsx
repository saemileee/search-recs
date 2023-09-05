import React, {useEffect, useRef, useState} from 'react';
import * as Fetcher from '../apis/search';
import * as Type from '../types/searchTypes';
import styled from 'styled-components';

const MAX_RECS_LENGTH = 7;
const MainContainer = () => {
    const searchInput = useRef(null);

    const [typedChar, setTypedChar] = useState('');
    const [recs, setRecs] = useState<Type.searchRec[]>([]);
    const [isLoading, setIsLoading] = useState(typedChar.length ? true : false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [focusingIdx, setFocusingIdx] = useState<number | null>(null);
    const focusingRecKeyword =
        recs.length > 0 && focusingIdx !== null ? recs[focusingIdx].sickNm : typedChar;

    const getSearchRecs = async (char: string) => {
        try {
            const data = await Fetcher.getSearchRecs(char);
            const splicedData = data.splice(0, MAX_RECS_LENGTH);
            setRecs(splicedData);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTypeKeyword = (char: string) => {
        setFocusingIdx(null);
        setTypedChar(char);
        if (char.length) {
            getSearchRecs(char);
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
                        if (e.key === 'Enter') return handleOnSubmit(focusingRecKeyword);
                        changeFocusingIdx(e.key);
                    }}
                    onFocus={activateSearch}
                    placeholder='질환명을 입력해 주세요.'
                />
                {isSearchActive && <button>x</button>}
                <button type='submit' onClick={() => handleOnSubmit(typedChar)}>
                    Search
                </button>
            </div>
            {isSearchActive && (
                <div>
                    <ul>
                        {isLoading && <li>검색 중...</li>}
                        {recs.length > 0 && (
                            <React.Fragment>
                                <label>추천 검색어</label>
                                {recs.map((data, idx) => (
                                    <KeywordStyled
                                        className={focusingIdx === idx ? 'focused' : ''}
                                        key={data.sickCd}
                                        onMouseOver={() => setFocusingIdx(idx)}
                                        onClick={() => handleOnSubmit(data.sickNm)}
                                    >
                                        {data.sickNm}
                                    </KeywordStyled>
                                ))}
                            </React.Fragment>
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
