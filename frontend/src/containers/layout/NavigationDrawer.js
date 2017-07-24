// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uiToggleDrawer } from '../../actions';
import { push } from 'react-router-redux'

import muiThemeable from 'material-ui/styles/muiThemeable';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import SvgIcon from 'material-ui/SvgIcon';
import IconButton from 'material-ui/IconButton';

import IconChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import IconHome from 'material-ui/svg-icons/action/home';
import IconPeople from 'material-ui/svg-icons/social/people';
import IconAccountBalance from 'material-ui/svg-icons/action/account-balance';
import IconFace from 'material-ui/svg-icons/action/face';
const IconGithub = (props) => (
    <SvgIcon viewBox="0 0 16 16" {...props}>
        <path d="M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.09-.202-.36-1.015.07-2.117 0 0 .67-.215 2.2.82.64-.178 1.32-.266 2-.27.68.004 1.36.092 2 .27 1.52-1.035 2.19-.82 2.19-.82.43 1.102.16 1.915.08 2.117.51.56.82 1.274.82 2.147 0 3.073-1.87 3.75-3.65 3.947.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.14.46.55.38C13.71 14.53 16 11.53 16 8c0-4.418-3.582-8-8-8" />
    </SvgIcon>
);

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

    onItemTap = path => {
        if (!path) {
            return;
        }

        this.onDrawerStateChange(false);
        this.props.push(path);
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

    renderMenuItem(text, icon, path, href = null) {
        return (
            <MenuItem
                leftIcon={icon}
                onTouchTap={() => this.onItemTap(path)}
                href={href}
            >
                {text}
            </MenuItem>
        );
    }

    render() {
        return (
            <Drawer
                docked={false}
                open={this.props.open}
                onRequestChange={this.onDrawerStateChange}
            >

                {this.renderHead()}

                {this.renderMenuItem('Startseite', <IconHome />, '/')}
                {this.renderMenuItem('Vorstellungen', <IconPeople />, '/shows')}
                {this.renderMenuItem('Produktionen', <IconAccountBalance />, '/productions')}
                {this.renderMenuItem('Darsteller', <IconFace />, '/actors')}
                <Divider />
                {this.renderMenuItem('Github', <IconGithub />, null, 'http://www.github.com/tanzdervampire')}
                {this.renderMenuItem('Impressm', null, '/legal')}
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