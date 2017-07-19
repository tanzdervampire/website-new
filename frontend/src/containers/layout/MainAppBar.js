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

    getRoute() {
        const { location } = this.props;
        const route = routes.filter(route => route.path === location.pathname);
        return route.length === 1 ? route[0] : null;
    }

    getTitle() {
        const route = this.getRoute();
        return route && route.drawerEntry ? route.drawerEntry.text : null;
    }

    renderSearchIcon() {
        const route = this.getRoute();
        if (!route || !route.supportsSearch) {
            return null;
        }

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