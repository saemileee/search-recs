export type searchRec = {sickCd: string; sickNm: string};

export type SearchCache = Map<string, {createdAt: number; expireTime: number; data: searchRec[]}>;
