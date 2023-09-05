import {searchAPI} from './axiosInstance';

export const getSearchRecs = async (char: string) => {
    const res = await searchAPI.get('?q=' + char);
    return res.data;
};
