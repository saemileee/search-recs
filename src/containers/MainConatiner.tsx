import styled from 'styled-components';
import Search from '../componenets/Search';

const MainContainer = () => {
    return (
        <ContainerStyled>
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
    }
`;
