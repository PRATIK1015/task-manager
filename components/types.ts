export const SET_ALERT = 'SET_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';
export const SHOW_SPINNER = 'SHOW_SPINNER';

export interface OptionsInterface {
    name: string;
    value: number | string;
}

export interface FormError {
    [key: string]: boolean;
}
