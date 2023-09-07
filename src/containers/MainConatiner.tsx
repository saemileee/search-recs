import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Search from '../componenets/Search';

const MainContainer = () => {
    return (
        <ContainerStyled>
            <Link to='/main'>이동</Link>
            <div className='search-wrapper'>
                <h1>
                    국내 모든 임상시험 검색하고
                    <br />
                    온라인으로 참여하기
                </h1>
                <Search />
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

                    .bold {
                        font-weight: 700;
                    }
                }
            }
        }
    }
`;
