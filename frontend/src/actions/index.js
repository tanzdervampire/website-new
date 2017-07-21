// @flow

export const UI_TOGGLE_DRAWER = 'UI_TOGGLE_DRAWER';

export const UI_CHANGE_SHOW_LIST_DATE = 'UI_CHANGE_SHOW_LIST_DATE';
export const UI_RESET_SHOW_LIST_DATE = 'UI_RESET_SHOW_LIST_DATE';

export const UI_SET_TITLE = 'UI_SET_TITLE';
export const UI_INVALIDATE_TITLE = 'UI_INVALIDATE_TITLE';

export const UI_SHOW_SEARCH_ICON = 'UI_SHOW_SEARCH_ICON';

export function uiToggleDrawer() {
    return { type: UI_TOGGLE_DRAWER };
}

export function uiChangeShowListDate(unit, diff) {
    return { type: UI_CHANGE_SHOW_LIST_DATE, unit, diff };
}

export function uiResetShowListDate() {
    return { type: UI_RESET_SHOW_LIST_DATE };
}

export function uiSetTitle(title) {
    return { type: UI_SET_TITLE, title };
}

export function uiInvalidateTitle(title) {
    return { type: UI_INVALIDATE_TITLE, title };
}

export function uiShowSearchIcon(show) {
    return { type: UI_SHOW_SEARCH_ICON, show };
}