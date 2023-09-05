import {searchAPI} from './axiosInstance';

export const getSearchRecs = async (char: string) => {
    console.info('calling api');
    const res = await searchAPI.get('?q=' + char);
    return res;
};
