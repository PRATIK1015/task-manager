import { SHOW_SPINNER } from '../types';

const spinnerReducer = (state: any[],action: any) => {
    switch (action.type) {
        case SHOW_SPINNER:
            return action.payload;
        default:
            return state;
    }
};

export default spinnerReducer;
