// @flow

import {
    UI_TOGGLE_DRAWER,
} from '../actions/';

const initialState = {
    /* Whether the navigation drawer is currently open. */
    isDrawerOpen: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UI_TOGGLE_DRAWER:
            return {
                ...state,
                isDrawerOpen: !state.isDrawerOpen,
            };
        default:
            return state;
    }
};