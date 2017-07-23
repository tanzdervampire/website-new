// @flow

import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MuiThemeProviderNext from 'material-ui-next/styles/MuiThemeProvider';
import spacing from 'material-ui/styles/spacing';

import theme from './theme';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

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
            <div>
                <div className="app--head">
                    <Route component={NavigationDrawer} />
                    <Route component={MainAppBar} />

                    <Switch>
                        <Route path='/shows' exact component={PageShowHead} />
                    </Switch>
                </div>

                <div className="app--content">
                    <Switch>
                        <Route path='/' exact component={null} />
                        <Route path='/shows' component={PageShowBody} />
                        <Route path='/productions' component={null} />
                        <Route path='/actors' component={null} />
                        <Route path='/legal' exact component={null} />
                        {/* TODO FIXME Add a 404 page. */}
                    </Switch>
                </div>

                {/* TODO FIXME Turn this into a component within Page? */}
                {/* TODO FIXME Turn into »scroll up« button (secondary?) when scrolled */}
                <FloatingActionButton style={{ zIndex: 1, position: 'fixed', bottom: spacing.desktopGutterLess, right: spacing.desktopGutterLess }}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        </ThemeProvider>
    );
};