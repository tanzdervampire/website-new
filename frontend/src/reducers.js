// @flow

import { INCREMENT } from './actions';

export const reduceCount = (state = 0, action) => {
    switch (action.type) {
        case INCREMENT:
            return state + 1;
        default:
            return state;
    }
};

export default {
    count: reduceCount,
};