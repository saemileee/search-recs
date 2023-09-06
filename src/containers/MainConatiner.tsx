import React, {useRef, useState} from 'react';
import styled from 'styled-components';
import useSearch from '../hooks/controllers/useSearch';
import useDebounce from '../hooks/useDebounce';
import useFocusingIdx from '../hooks/useKeydown';
import useHelperBox from '../hooks/useHelperBoxState';
import {Link} from 'react-router-dom';
import {isValidKeyword} from '../utils/regex';

const DEBOUNCING_TIME = 500;

const MainContainer = () => {
    const searchInput = useRef(null);

    const [typedSearchKeyword, setTypedSearchKeyword] = useState('');

    const {isLoading, data: recs, getSearchRecs} = useSearch();
    const {onKeydownHandler, focusingIdx, setFocusingIdx} = useFocusingIdx(recs.length);
    const {isShowing: isHelperBoxShow, showHelperBox, closeHelperBox} = useHelperBox([searchInput]);
    const debounce = useDebounce();

    const searchKeyword =
        recs.length > 0 && focusingIdx !== null ? recs[focusingIdx].sickNm : typedSearchKeyword;

    const handleChangeInput = (char: string) => {
        setFocusingIdx(null);
        setTypedSearchKeyword(char);
        if (char.length) {
            showHelperBox();
            debounce(() => isValidKeyword(char) && getSearchRecs(char, 3600000), DEBOUNCING_TIME);
        } else {
            closeHelperBox();
        }
    };

    const hanldeInputKeydown = (e: React.KeyboardEvent) => {
        onKeydownHandler(e);
        if (e.key === 'Enter') return handleOnSubmit(searchKeyword);
    };

    const activateSearch = () => {
        typedSearchKeyword.length && showHelperBox();
    };

    const removeSearchKeyword = () => {
        setTypedSearchKeyword('');
    };

    const handleOnSubmit = (searchKeyword: string) => {
        typedSearchKeyword && alert(searchKeyword);
        setFocusingIdx(null);
        setTypedSearchKeyword('');
        closeHelperBox();
    };

    return (
        <ContainerStyled>
            <Link to='/main'>이동</Link>
            <div className='search-wrapper'>
                <h1>
                    국내 모든 임상시험 검색하고
                    <br />
                    온라인으로 참여하기
                </h1>
                <div className='search-box'>
                    <input
                        ref={searchInput}
                        type='text'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChangeInput(e.target.value)
                        }
                        onKeyDown={hanldeInputKeydown}
                        onFocus={activateSearch}
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
                {isHelperBoxShow && (
                    <div className='helper-box'>
                        <ul>
                            {!isLoading && recs.length > 0 && typedSearchKeyword.length > 0 && (
                                <React.Fragment>
                                    <label>추천 검색어</label>
                                    {recs.map((data, idx) => (
                                        <li
                                            className={focusingIdx === idx ? 'focused' : ''}
                                            key={data.sickCd}
                                            onMouseOver={() => setFocusingIdx(idx)}
                                            onClick={() => handleOnSubmit(searchKeyword)}
                                        >
                                            {data.sickNm}
                                        </li>
                                    ))}
                                </React.Fragment>
                            )}
                            {!isLoading && recs.length === 0 && typedSearchKeyword.length > 0 && (
                                <li className='no-rec-message'>추천 검색어가 없습니다.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </ContainerStyled>
    );
};

export default MainContainer;

const ContainerStyled = styled.div`
    width: 100%;
    height: 450px;
    display: flex;
    justify-content: center;
    background-color: #cae9ff;

    .search-wrapper {
        min-width: 1024px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;

        h1 {
            text-align: center;
        }
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
                }
            }
        }
    }
`;
