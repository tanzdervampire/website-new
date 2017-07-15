// @flow

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from './theme';
import AppBar from 'material-ui/AppBar';
import { Tabs, Tab } from 'material-ui/Tabs';

class App extends Component {

    render() {
        return (
            <MuiThemeProvider muiTheme={theme}>
                <div>
                    <AppBar
                        title="Tanz der Vampire"
                        zDepth={0}
                    />

                    <Tabs>
                        <Tab label="Lorem">
                            <p>Foo!</p>
                        </Tab>
                        <Tab label="Ipsum">
                            <p>Bar?</p>
                        </Tab>
                    </Tabs>
                </div>
            </MuiThemeProvider>
        );
    }

}

export default App;