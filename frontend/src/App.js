// @flow

import React, { Component } from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import spacing from 'material-ui/styles/spacing';

import theme from './theme';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import NavigationDrawer from './containers/layout/NavigationDrawer';
import MainAppBar from './containers/layout/MainAppBar';

import { Switch, Route } from 'react-router-dom';
import PageShowHead from './containers/pages/shows/PageShowHead';
import PageShowBody from './containers/pages/shows/PageShowBody';

class App extends Component {

    render() {
        return (
            <MuiThemeProvider muiTheme={theme}>
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
                        </Switch>
                    </div>

                    {/* TODO FIXME Turn into »scroll up« button (secondary?) when scrolled */}
                    <FloatingActionButton style={{ zIndex: 1, position: 'fixed', bottom: spacing.desktopGutterLess, right: spacing.desktopGutterLess }}>
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
            </MuiThemeProvider>
        );
    }

}

export default App;