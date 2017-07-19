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
import routes from './routes';

class App extends Component {

    renderRoute(route, component, keyPrefix) {
        if (!route.path) {
            return null;
        }

        return (
            <Route
                key={`${keyPrefix}-${route.path}`}
                path={route.path}
                exact={route.exact}
                component={component}
            />
        );
    }

    renderHeadRoute(route) {
        return this.renderRoute(route, route.headComponent, 'head');
    }

    renderContentRoute(route) {
        return this.renderRoute(route, route.contentComponent, 'content');
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={theme}>
                <div>
                    <div className="app--head">
                        <Route component={NavigationDrawer} />
                        <Route component={MainAppBar} />

                        <Switch>
                            { routes.map(this.renderHeadRoute.bind(this)) }
                        </Switch>
                    </div>

                    <div className="app--content">
                        <Switch>
                            { routes.map(this.renderContentRoute.bind(this)) }
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