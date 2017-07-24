// @flow

import {
    SHOWS_FETCH_HAS_STARTED,
    SHOWS_FETCH_SUCCESS,
    SHOWS_FETCH_ERROR,
} from '../actions/';

const initialState = {
    shows: [],

    isFetchInProgress: false,
    hasFetchErrored: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SHOWS_FETCH_HAS_STARTED:
            return { ...state, isFetchInProgress: true, hasFetchErrored: false };
        case SHOWS_FETCH_SUCCESS:
            return {
                ...state,
                isFetchInProgress: false,
                hasFetchErrored: false,
                shows: action.shows,
            };
        case SHOWS_FETCH_ERROR:
            return { ...state, isFetchInProgress: false, hasFetchErrored: true };
        default:
            return state;
    }
};