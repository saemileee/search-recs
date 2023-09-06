import React, {useRef, useState} from 'react';
import styled from 'styled-components';
import useSearchQuery from '../hooks/useSearch';
import useDebounce from '../hooks/useDebounce';
import useFocusingIdx from '../hooks/useKeydown';
import useHelperBox from '../hooks/useHelperBoxState';

const DEBOUNCING_TIME = 500;

const MainContainer = () => {
    const searchInput = useRef(null);

    const [typedSearchKeyword, setTypedSearchKeyword] = useState('');

    const {isLoading, data: recs, getSearchRecs} = useSearchQuery();
    const {onKeydownHandler, focusingIdx, setFocusingIdx} = useFocusingIdx(recs.length);
    const {isShowing: isHelperBoxShow, showHelperBox} = useHelperBox(searchInput);
    const debounce = useDebounce();

    const searchKeyword =
        recs.length > 0 && focusingIdx !== null ? recs[focusingIdx].sickNm : typedSearchKeyword;

    const handleChangeInput = (char: string) => {
        setFocusingIdx(null);
        setTypedSearchKeyword(char);
        if (char.length) {
            debounce(() => char.length && getSearchRecs(char, 10000), DEBOUNCING_TIME);
        }
    };

    const hanldeInputKeydown = (e: React.KeyboardEvent) => {
        onKeydownHandler(e);
        if (e.key === 'Enter') return handleOnSubmit(searchKeyword);
    };

    const activateSearch = () => {
        showHelperBox();
    };

    const handleOnSubmit = (searchKeyword: string) => {
        alert(searchKeyword);
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
                    ref={searchInput}
                    type='text'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChangeInput(e.target.value)
                    }
                    onKeyDown={hanldeInputKeydown}
                    onFocus={activateSearch}
                    placeholder='질환명을 입력해 주세요.'
                />
                {isHelperBoxShow && <button>x</button>}
                <button type='submit' onClick={() => handleOnSubmit(typedSearchKeyword)}>
                    Search
                </button>
            </div>
            {isHelperBoxShow && (
                <div>
                    <ul>
                        {!isLoading && recs.length > 0 && typedSearchKeyword.length > 0 && (
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
                        )}
                        {!isLoading && recs.length === 0 && <li>추천 검색어가 없습니다 :(</li>}
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
