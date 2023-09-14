import React, {useRef, useState} from 'react';

import useSearch from '../hooks/controllers/useSearch';
import useDebounce from '../hooks/useDebounce';
import useFocusingIdx from '../hooks/useFocusingIdx';
import useHelperBox from '../hooks/useHelperBoxState';
import {isValidKeyword} from '../utils/regex';
import styled from 'styled-components';

const DEBOUNCING_TIME = 500;
const CACHE_EXPIRE_TIME = 50000;

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
            ? recs[keyBoardFocusingIdx]
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

    const handleInputKeydown = (e: React.KeyboardEvent) => {
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
        <SearchContainerStyled>
            <div className='search-box'>
                <input
                    ref={searchInput}
                    type='text'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChangeInput(e.target.value)
                    }
                    onKeyDown={handleInputKeydown}
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
                                {recs.map((item, idx) => (
                                    <li
                                        className={
                                            keyBoardFocusingIdx === idx || mouseFocusingIdx === idx
                                                ? 'focused'
                                                : undefined
                                        }
                                        key={`data-${idx}`}
                                        onMouseOver={() => onMouseHoverFocusing(idx)}
                                        onMouseLeave={() => initFocusingIdx()}
                                        onClick={() => handleOnSubmit(item)}
                                    >
                                        {item.split(typedSearchKeyword).map((s, idx) => (
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
        </SearchContainerStyled>
    );
};

export default Search;

const SearchContainerStyled = styled.div`
    .search-box {
        margin: 0 auto;
        align-self: center;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 490px;
        height: 74px;
        border-radius: 150px;
        background-color: white;
        box-sizing: border-box;

        input {
            box-sizing: border-box;
            width: 80%;
            padding: 0 40px 0 40px;
            font-size: 20px;
            border: none;
            background-color: unset;
            outline: unset;
        }

        .remove-btn {
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            margin-right: 12px;
            border: none;
            background-color: darkgray;
            color: white;
            border-radius: 50%;
            font-weight: 600;
            line-height: 0.5em;
            font-size: 17px;
            cursor: pointer;
        }

        .submit-btn {
            margin-right: 14px;
            background-color: rgb(0, 123, 233);
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
        }
    }

    .helper-box {
        left: 50%;
        top: 320px;
        position: absolute;
        z-index: 1;
        margin-top: 16px;
        background-color: white;
        width: 490px;
        border-radius: 24px;
        padding: 12px 0 12px 0;
        box-sizing: border-box;
        transform: translateX(-50%);
        box-shadow: 0 0 15px #d2d7d88b;
        ul {
            margin: 0;
            padding: 0;
            list-style-position: outside;
            list-style-type: none;
            label {
                display: block;
                padding: 10px 32px 10px 32px;
                color: #aaafaf;
                font-weight: 600;
                font-size: 14px;
            }
            li {
                padding: 10px 32px 10px 32px;
                font-size: 18px;
                &.focused {
                    background-color: #f0f4f4;
                }
                cursor: pointer;

                &.no-rec-message {
                    text-align: center;
                    color: #aaafaf;
                    font-weight: 600;
                    font-size: 14px;
                }

                .bold {
                    font-weight: 700;
                }
            }
        }
    }
`;
