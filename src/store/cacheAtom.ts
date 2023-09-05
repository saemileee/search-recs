import {atom} from 'recoil';
import * as Type from '../types/searchTypes';

export const cacheData = atom<Type.SearchCache>({
    key: 'cacheData',
    default: new Map(),
});
