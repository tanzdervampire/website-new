// @flow

export const UI_TOGGLE_DRAWER = 'UI_TOGGLE_DRAWER';
export const UI_CHANGE_SHOW_LIST_DATE = 'UI_CHANGE_SHOW_LIST_DATE';
export const UI_RESET_SHOW_LIST_DATE = 'UI_RESET_SHOW_LIST_DATE';

export function uiToggleDrawer() {
    return { type: UI_TOGGLE_DRAWER };
}

export function uiChangeShowListDate(unit, diff) {
    return {
        type: UI_CHANGE_SHOW_LIST_DATE,
        unit,
        diff,
    };
}

export function uiResetShowListDate() {
    return { type: UI_RESET_SHOW_LIST_DATE };
}