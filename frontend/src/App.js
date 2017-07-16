// @flow

import React, { Component } from 'react';

import moment from 'moment';
import 'moment/locale/de';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import spacing from 'material-ui/styles/spacing';

import theme from './theme';

import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Search from 'material-ui/svg-icons/action/search';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import SkipPrevious from 'material-ui/svg-icons/av/skip-previous';
import SkipNext from 'material-ui/svg-icons/av/skip-next';
import Face from 'material-ui/svg-icons/action/face';
import Home from 'material-ui/svg-icons/action/home';
import People from 'material-ui/svg-icons/social/people';
import AccountBalance from 'material-ui/svg-icons/action/account-balance';
import Drawer from 'material-ui/Drawer';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import {List, ListItem} from 'material-ui/List';
import {transparent} from 'material-ui/styles/colors';

import SvgIcon from 'material-ui/SvgIcon';
const GithubIcon = (props) => (
    <SvgIcon viewBox="0 0 16 16" {...props}>
        <path d="M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.09-.202-.36-1.015.07-2.117 0 0 .67-.215 2.2.82.64-.178 1.32-.266 2-.27.68.004 1.36.092 2 .27 1.52-1.035 2.19-.82 2.19-.82.43 1.102.16 1.915.08 2.117.51.56.82 1.274.82 2.147 0 3.073-1.87 3.75-3.65 3.947.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.46.55.38C13.71 14.53 16 11.53 16 8c0-4.418-3.582-8-8-8" />
    </SvgIcon>
);

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

    // TODO FIXME Display dates with no entry with a "+" button?
    // TODO FIXME Deal with empty months
    renderItems() {
        let items = [];
        for (let i = 1; i <= this.state.month.daysInMonth(); i++) {
            const current = this.state.month.clone().date(i);
            if (current.day() === 1) {
                continue;
            }

            items.push((
                <ListItem
                    key={`item1-${i}`}
                    primaryText="14:30 Uhr"
                    secondaryText="Palladium, Stuttgart"
                    leftAvatar={
                        <Avatar color={theme.palette.primary1Color} backgroundColor={transparent}>
                            <h2>{i}.</h2>
                        </Avatar>
                    }
                    rightAvatar={
                        <Avatar color={theme.palette.accent1Color} backgroundColor={transparent}>
                            {current.locale('de').format('dd')}
                        </Avatar>
                    }
                />
            ));

            if (current.day() === 0 || current.day() === 6) {
                items.push((
                    <ListItem
                        key={`item2-${i}`}
                        primaryText="19:30 Uhr"
                        secondaryText="Palladium, Stuttgart"
                        insetChildren={true}
                    />
                ));
            }

            items.push((<Divider key={`div-${i}`} inset={true}/>));
        }

        return items;
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={theme}>
                <div>
                    <Drawer
                        docked={false}
                        open={this.state.drawerIsOpen}
                        onRequestChange={(drawerIsOpen) => this.setState({ drawerIsOpen })}
                    >

                        <AppBar
                            showMenuIconButton={false}
                            zDepth={0}
                            iconElementRight={<IconButton><ChevronLeft /></IconButton>}
                            onRightIconButtonTouchTap={() => this.setState({ drawerIsOpen: !this.state.drawerIsOpen })}
                        />

                        <MenuItem leftIcon={<Home/>}>Startseite</MenuItem>
                        <MenuItem leftIcon={<People color={theme.palette.primary1Color}/>}>Vorstellungen</MenuItem>
                        <MenuItem leftIcon={<AccountBalance/>}>Produktionen</MenuItem>
                        <MenuItem leftIcon={<Face/>}>Darsteller</MenuItem>
                        <Divider/>
                        <MenuItem>Impressum</MenuItem>
                        <MenuItem leftIcon={<GithubIcon/>}>Github</MenuItem>
                    </Drawer>

                    <AppBar
                        zDepth={0}
                        title="Vorstellungen"
                        onLeftIconButtonTouchTap={() => this.setState({ drawerIsOpen: !this.state.drawerIsOpen })}
                        iconElementRight={<IconButton><Search /></IconButton>}
                    />

                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <IconButton onTouchTap={() => this.changeTime('years', 'subtract')}><SkipPrevious /></IconButton>
                            <IconButton onTouchTap={() => this.changeTime('months', 'subtract')}><ChevronLeft /></IconButton>
                        </ToolbarGroup>

                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.month.locale('de').format('MMMM YYYY')} />
                        </ToolbarGroup>

                        <ToolbarGroup lastChild={true}>
                            <IconButton onTouchTap={() => this.changeTime('months', 'add')}><ChevronRight /></IconButton>
                            <IconButton onTouchTap={() => this.changeTime('years', 'add')}><SkipNext /></IconButton>
                        </ToolbarGroup>
                    </Toolbar>

                    <List>
                        {this.renderItems()}
                    </List>

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