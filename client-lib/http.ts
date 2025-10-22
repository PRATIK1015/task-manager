import { isNullOrUndefined } from '../lib/utils';

function toFlat(obj: any, prefix: any) {
    let flat: any = {};
    if (Array.isArray(obj)) {
        if (obj.some((value) => typeof value === 'object')) {
            obj.forEach((value, index) => {
                if (value !== null && typeof value === 'object') {
                    flat = { ...toFlat(value, `${prefix}[${index}]`), ...flat };
                } else {
                    flat = { [`${prefix}[${index}]`]: value, ...flat };
                }
            });
        } else {
            flat[prefix] = obj;
        }
    } else {
        for (const key in obj) {
            if (Object.hasOwn(obj, key)) {
                const value = obj[key];
                if (value !== null && typeof value === 'object') {
                    flat = { ...toFlat(value, `${prefix}[${key}]`), ...flat };
                } else {
                    flat[`${prefix}[${key}]`] = value;
                }
            }
        }
    }
    return flat;
}

function serialize(obj: any) {
    let flatObj: any = {};
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            const value = obj[key];
            if (value !== null && typeof value === 'object') {
                flatObj = { ...toFlat(value, key), ...flatObj };
            } else {
                flatObj[key] = value;
            }
        }
    }
    return flatObj;
}


const unAuthorizedPaths = [
    '/v1/auth/login',
    '/v1/auth/signup',
];

async function call(
    method: string,
    url: string,
    { queryParams, headers, body }: any,
    isBuffer?: boolean
) {
    try {
        const originalUrl = url;
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_END_POINT || 'http://localhost:3000';
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

        if (queryParams) {
            // if (fullUrl.includes('?')) {
            //     // merge query params
            // }
            const urlWithParams = fullUrl + '?' + new URLSearchParams(serialize(queryParams)).toString();
            url = urlWithParams;
        } else {
            url = fullUrl;
        }
        headers = headers || {};
        let token = localStorage.getItem('token');
        if (token && !unAuthorizedPaths.includes(originalUrl)) {
            headers.Authorization = `Bearer ${token}`;
        }
        if (!headers['Content-Type']) {
            if (body instanceof FormData) {
            } else {
                headers['Content-Type'] = 'application/json';
                if (!isNullOrUndefined(body)) {
                    body = JSON.stringify(body);
                }
            }
        } else if ('application/json' === `${headers['Content-Type']}`.toLowerCase() && !isNullOrUndefined(body)) {
            body = JSON.stringify(body);
        } else if ('multipart/form-data' === `${headers['Content-Type']}`.toLowerCase()) {
            delete headers['Content-Type'];
        }
        const response = await fetch(url, {
            method,
            headers,
            body
        });
        let responseJson: any;

        if (isBuffer) {
            responseJson = await response.arrayBuffer();
        } else {
            responseJson = await response.text();
        }
        try {
            responseJson = JSON.parse(responseJson);
        } catch (e) {
            //
        }
        return responseJson;
    } catch (error: any) {
        let errorMessage;
        if (error?.errors?.length) {
            errorMessage = error.errors.map((e: any) => e.message).join(', ');
        } else {
            errorMessage = error.message;
        }

        throw error;
    }
}

const http = {
    get: async (url: string, { queryParams, headers, doNotShowLoader }: RequestEntity = {}) =>
        call('GET', url, { queryParams, headers, doNotShowLoader }),

    post: async (
        url: string,
        { queryParams, headers, body, doNotShowLoader }: RequestEntity = {},
        isBuffer?: boolean
    ) => call('POST', url, { queryParams, headers, body, doNotShowLoader }, isBuffer),

    put: async (url: string, { queryParams, headers, body, doNotShowLoader }: RequestEntity = {}) =>
        call('PUT', url, { queryParams, headers, body, doNotShowLoader }),

    delete: async (url: string, { queryParams, headers, doNotShowLoader }: RequestEntity = {}) =>
        call('DELETE', url, { queryParams, headers, doNotShowLoader }),
};

export default http;

interface RequestEntity {
    queryParams?: any;
    headers?: any;
    body?: any;
    doNotShowLoader?: boolean;
}
