import {searchAPI} from './axiosInstance';

export const getSearchRecs = async (char: string) => {
    console.info('calling api');
    const res = await searchAPI.get('?sickNm_like=' + char);
    return res;
};
