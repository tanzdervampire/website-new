// @flow

import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MuiThemeProviderNext from 'material-ui-next/styles/MuiThemeProvider';

import theme from './theme';

import NavigationDrawer from './containers/layout/NavigationDrawer';
import MainAppBar from './containers/layout/MainAppBar';

import { Switch, Route } from 'react-router-dom';
import PageShowHead from './containers/pages/shows/PageShowsHead';
import PageShowBody from './containers/pages/shows/PageShowsBody';

import createMuiTheme from 'material-ui-next/styles/theme'
import { red, indigo } from 'material-ui-next/colors'
import createPalette from 'material-ui-next/styles/palette'

// TODO FIXME Clean this up.
const ThemeProvider = props => {
    const nextTheme = createMuiTheme({
        palette: createPalette({
            primary: red,
            accent: indigo,
            error: red,
            type: 'light',
        })
    });

    return (
        <MuiThemeProvider muiTheme={theme}>
            <MuiThemeProviderNext theme={nextTheme}>
                { props.children }
            </MuiThemeProviderNext>
        </MuiThemeProvider>
    );
};

export default () => {
    return (
        <ThemeProvider>
            <div className="app-container">
                <div className="app-container--head">
                    <Route component={NavigationDrawer} />
                    <Route component={MainAppBar} />

                    <Switch>
                        <Route path='/shows' exact component={PageShowHead} />
                    </Switch>
                </div>

                <div className="app-container--content">
                    <Switch>
                        <Route path='/' exact component={null} />
                        <Route path='/shows' component={PageShowBody} />
                        <Route path='/productions' component={null} />
                        <Route path='/actors' component={null} />
                        <Route path='/legal' exact component={null} />
                        {/* TODO FIXME Add a 404 page. */}
                    </Switch>
                </div>
            </div>
        </ThemeProvider>
    );
};