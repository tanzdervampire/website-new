// @flow

import moment from 'moment';

import {
    UI_TOGGLE_DRAWER,
    UI_CHANGE_SHOW_LIST_DATE,
    UI_RESET_SHOW_LIST_DATE,
} from '../actions/';

const initialState = {
    /* Whether the navigation drawer is currently open. */
    isDrawerOpen: false,

    /* The selected date (month) for the list of shows. */
    showListDate: moment(),
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UI_TOGGLE_DRAWER:
            return {
                ...state,
                isDrawerOpen: !state.isDrawerOpen,
            };
        case UI_CHANGE_SHOW_LIST_DATE:
            return {
                ...state,
                showListDate: state.showListDate.clone().add(action.diff, action.unit),
            };
        case UI_RESET_SHOW_LIST_DATE:
            return {
                ...state,
                showListDate: moment(),
            };
        default:
            return state;
    }
};