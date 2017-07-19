// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uiToggleDrawer } from '../../actions/index';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';

import routes from '../../routes';

class MainAppBar extends Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
    };

    onMenuButton = () => {
        this.props.uiToggleDrawer();
    };

    getTitle() {
        const { location } = this.props;
        const route = routes.filter(route => route.path === location.pathname);
        if (route.length === 1 && route[0].drawerEntry) {
            return route[0].drawerEntry.text;
        }

        return null;
    }

    renderSearchIcon() {
        return (
            <IconButton>
                <Search />
            </IconButton>
        );
    }

    // TODO FIXME Title should depend on the route.
    render() {
        return (
            <AppBar
                zDepth={0}
                title={this.getTitle()}
                onLeftIconButtonTouchTap={this.onMenuButton}
                iconElementRight={this.renderSearchIcon()}
            />
        );
    }

}

const mapStateToProps = state => {
    return {};
};

export default connect(
    mapStateToProps,
    { uiToggleDrawer },
)(MainAppBar);