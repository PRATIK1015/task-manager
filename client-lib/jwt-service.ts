import { jwtDecode } from 'jwt-decode';

export function isExpired(token: string) {
    const userData = jwtDecode(token);
    if (!userData.exp) {
        return false;
    }
    const exp = userData.exp * 1000;
    return Date.now() > exp;
}

export function decodeToken(token: string) {
    return jwtDecode(token);
}
