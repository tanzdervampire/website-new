// @flow

import moment from 'moment';

import {
    UI_TOGGLE_DRAWER,
    UI_CHANGE_SHOW_LIST_DATE,
    UI_RESET_SHOW_LIST_DATE,
    UI_SET_TITLE,
    UI_INVALIDATE_TITLE,
    UI_SHOW_SEARCH_ICON,
} from '../actions';

const initialState = {
    /* Whether the navigation drawer is currently open. */
    isDrawerOpen: false,

    /* The selected date (month) for the list of shows. */
    showListDate: moment(),

    /* The title shown, e.g., in the app bar. */
    title: null,

    /* Whether to display the search icon in the app bar. */
    showSearchIcon: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UI_TOGGLE_DRAWER:
            return { ...state, isDrawerOpen: !state.isDrawerOpen };
        case UI_CHANGE_SHOW_LIST_DATE:
            return { ...state, showListDate: state.showListDate.clone().add(action.diff, action.unit) };
        case UI_RESET_SHOW_LIST_DATE:
            return { ...state, showListDate: moment() };
        case UI_SET_TITLE:
            return { ...state, title: action.title };
        case UI_INVALIDATE_TITLE:
            if (state.title !== action.title) {
                return state;
            }

            return { ...state, title: null };
        case UI_SHOW_SEARCH_ICON:
            return { ...state, showSearchIcon: action.show };
        default:
            return state;
    }
};