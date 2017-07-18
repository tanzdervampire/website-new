// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uiToggleDrawer } from '../../actions/index';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';

class MainAppBar extends Component {

    onMenuButton = () => {
        this.props.uiToggleDrawer();
    };

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
                title="Vorstellungen"
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