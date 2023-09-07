import React, {useRef, useState} from 'react';

import useSearch from '../hooks/controllers/useSearch';
import useDebounce from '../hooks/useDebounce';
import useFocusingIdx from '../hooks/useFocusingIdx';
import useHelperBox from '../hooks/useHelperBoxState';
import {isValidKeyword} from '../utils/regex';

const DEBOUNCING_TIME = 500;
const CACHE_EXPIRE_TIME = 3600000;

const Search = () => {
    const searchInput = useRef(null);

    const [typedSearchKeyword, setTypedSearchKeyword] = useState('');

    const {isLoading, data: recs, getSearchRecs, initSearchRecs} = useSearch();

    const {
        onKeydownFocusing,
        onMouseHoverFocusing,
        keyBoardFocusingIdx,
        mouseFocusingIdx,
        initFocusingIdx,
    } = useFocusingIdx(recs.length);

    const {
        isShowing: isHelperShowByMouse,
        showHelperBox,
        closeHelperBox,
    } = useHelperBox([searchInput]);
    const debounce = useDebounce();

    const isHelperShow = typedSearchKeyword.length > 0 && isHelperShowByMouse;
    const isSearching = isHelperShow && !recs.length && isLoading;
    const isRecListShow = isHelperShow && !isLoading && recs.length > 0;
    const isNoRecMsgShow = isHelperShow && !isLoading && !recs.length;

    const searchKeywordByKeyboard =
        recs.length > 0 && keyBoardFocusingIdx !== null
            ? recs[keyBoardFocusingIdx].sickNm
            : typedSearchKeyword;

    const handleChangeInput = (char: string) => {
        initFocusingIdx();
        setTypedSearchKeyword(char);
        initSearchRecs();

        if (char.length) {
            showHelperBox();
            debounce(
                () => isValidKeyword(char) && getSearchRecs(char, CACHE_EXPIRE_TIME),
                DEBOUNCING_TIME
            );
        }
    };

    const removeSearchKeyword = () => {
        setTypedSearchKeyword('');
    };

    const hanldeInputKeydown = (e: React.KeyboardEvent) => {
        if (e.nativeEvent.isComposing) return;
        onKeydownFocusing(e);
        if (e.key === 'Enter') return handleOnSubmit(searchKeywordByKeyboard);
    };

    const initUI = () => {
        initFocusingIdx();
        setTypedSearchKeyword('');
        closeHelperBox();
    };

    const handleOnSubmit = (searchKeyword: string) => {
        typedSearchKeyword && alert(searchKeyword);
        initUI();
    };

    return (
        <>
            <div className='search-box'>
                <input
                    ref={searchInput}
                    type='text'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChangeInput(e.target.value)
                    }
                    onKeyDown={hanldeInputKeydown}
                    placeholder='🔍 질환명을 입력해 주세요.'
                    value={typedSearchKeyword}
                />
                {typedSearchKeyword.length > 0 && (
                    <button className='remove-btn' onClick={removeSearchKeyword}>
                        x
                    </button>
                )}
                <button
                    className='submit-btn'
                    type='submit'
                    onClick={() => handleOnSubmit(typedSearchKeyword)}
                >
                    🔍
                </button>
            </div>
            {isHelperShow && (
                <div className='helper-box'>
                    <ul>
                        {isSearching && <li>검색 중...</li>}
                        {isRecListShow && (
                            <React.Fragment>
                                <label>추천 검색어</label>
                                {recs.map((data, idx) => (
                                    <li
                                        className={
                                            keyBoardFocusingIdx === idx || mouseFocusingIdx === idx
                                                ? 'focused'
                                                : undefined
                                        }
                                        key={data.sickCd}
                                        onMouseOver={() => onMouseHoverFocusing(idx)}
                                        onMouseLeave={() => initFocusingIdx()}
                                        onClick={() => handleOnSubmit(data.sickNm)}
                                    >
                                        {data.sickNm.split(typedSearchKeyword).map((s, idx) => (
                                            <React.Fragment key={idx}>
                                                {idx > 0 && (
                                                    <span className='bold'>
                                                        {typedSearchKeyword}
                                                    </span>
                                                )}
                                                {s}
                                            </React.Fragment>
                                        ))}
                                    </li>
                                ))}
                            </React.Fragment>
                        )}
                        {isNoRecMsgShow && (
                            <li className='no-rec-message'>추천 검색어가 없습니다.</li>
                        )}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Search;
