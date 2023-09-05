import {useEffect} from 'react';
import * as Fetcher from '../apis/search';

const MainContainer = () => {
    useEffect(() => {
        const getSearchRecs = async () => {
            const data = await Fetcher.getSearchRecs('');
            console.info(data);
        };
        getSearchRecs();
    }, []);
    return <h1>Main</h1>;
};

export default MainContainer;
