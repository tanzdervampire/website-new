// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uiToggleDrawer } from '../../actions/index';
import { push } from 'react-router-redux'

import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';

import routes from '../../routes';

import IconChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

class NavigationDrawer extends Component {

    static propTypes = {
        muiTheme: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
    };

    onDrawerStateChange = open => {
        if (open === undefined || open !== this.props.open) {
            this.props.uiToggleDrawer();
        }
    };

    onItemTap = item => {
        if (item.path) {
            this.onDrawerStateChange(false);
            this.props.push(item.path);
        }
    };

    renderHeadIcon() {
        return (
            <IconButton>
                <IconChevronLeft />
            </IconButton>
        );
    }

    renderHead() {
        return (
            <AppBar
                showMenuIconButton={false}
                zDepth={0}
                iconElementRight={this.renderHeadIcon()}
                onRightIconButtonTouchTap={this.onDrawerStateChange}
            />
        );
    }

    renderItem(item) {
        const { icon, text, insertDivider, href } = item.drawerEntry;

        const divider = insertDivider ? (<Divider key={`${text}-divider`} />) : null;
        const menuItem = (
            <MenuItem
                key={text}
                leftIcon={icon}
                onTouchTap={() => this.onItemTap(item)}
                href={href}
            >
                {text}
            </MenuItem>
        );

        return [menuItem, divider];
    }

    renderItems() {
        return routes
            .filter(route => route.drawerEntry)
            .map(this.renderItem.bind(this))
            .reduce((a, b) => [...a, ...b], []);
    }

    render() {
        return (
            <Drawer
                docked={false}
                open={this.props.open}
                onRequestChange={this.onDrawerStateChange}
            >

                {this.renderHead()}
                {this.renderItems()}
            </Drawer>
        );
    }

}

const mapStateToProps = state => {
    return {
        open: state.ui.isDrawerOpen,
    };
};

export default connect(
    mapStateToProps,
    { push, uiToggleDrawer },
)(muiThemeable()(NavigationDrawer));