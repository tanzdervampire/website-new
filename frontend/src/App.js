// @flow

import React, { Component } from 'react';

import moment from 'moment';
import 'moment/locale/de';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import spacing from 'material-ui/styles/spacing';

import theme from './theme';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import NavigationDrawer from './containers/layout/NavigationDrawer';
import MainAppBar from './containers/layout/MainAppBar';

import MonthPicker from './components/month-picker/MonthPicker';
import ShowList from './components/show-list/ShowList';

class App extends Component {

    state = {
        drawerIsOpen: false,
        month: moment(),
    };

    changeTime = (type, direction) => {
        const { month } = this.state;
        const diff = (direction === 'add') ? 1 : -1;
        this.setState({ month: month.clone().add(diff, type) });
    };

    getFakeItems() {
        const toItem = (day, hour, minute) => {
            const date = day.clone().set({ hour, minute });
            return {
                date,
                location: 'Palladium, Stuttgart',
            };
        };

        let items = [];
        for (let i = 1; i <= this.state.month.daysInMonth(); i++) {
            const current = this.state.month.clone().date(i);
            if (current.day() === 1) {
                continue;
            }

            items.push(toItem(current, 19, 30));
            if (current.day() === 0 || current.day() === 6) {
                items.push(toItem(current, 14, 30));
            }
        }

        return items;
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={theme}>
                <div>
                    <NavigationDrawer />
                    <MainAppBar />

                    <MonthPicker
                        month={this.state.month}
                        onSkipBack={(type) => this.changeTime(type, 'subtract')}
                        onSkipForward={(type) => this.changeTime(type, 'add')}
                    />

                    <ShowList
                        items={this.getFakeItems()}
                    />

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