// @flow

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {
    red500, red700,
    grey100, grey400, grey500,
    indigo500,
} from 'material-ui/styles/colors';

const theme = Object.assign({}, baseTheme, {
    palette: Object.assign({}, baseTheme.palette, {
        primary1Color: red500,
        primary2Color: red700,
        primary3Color: grey400,
        accent1Color: indigo500,
        accent2Color: grey100,
        accent3Color: grey500,
        pickerHeaderColor: red500,
    }),
});

export default getMuiTheme(theme);