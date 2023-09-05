import axios from 'axios';
class AxiosInstance {
    baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    instance(endPoint: string) {
        return axios.create({
            baseURL: this.baseUrl + endPoint,
        });
    }
}

const httpClient = new AxiosInstance(process.env.REACT_APP_SEARCH_BASE_URL || '');

export const searchAPI = httpClient.instance('/sick');
