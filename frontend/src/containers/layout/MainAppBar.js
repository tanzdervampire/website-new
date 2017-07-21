// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uiToggleDrawer } from '../../actions/index';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';

class MainAppBar extends Component {

    static propTypes = {
        title: PropTypes.string,
        supportsSearch: PropTypes.bool,
    };

    onMenuButton = () => {
        this.props.uiToggleDrawer();
    };

    renderSearchIcon() {
        if (!this.props.supportsSearch) {
            return null;
        }

        return (
            <IconButton>
                <Search />
            </IconButton>
        );
    }

    render() {
        return (
            <AppBar
                zDepth={0}
                title={this.props.title}
                onLeftIconButtonTouchTap={this.onMenuButton}
                iconElementRight={this.renderSearchIcon()}
            />
        );
    }

}

const mapStateToProps = state => {
    return {
        title: state.ui.title,
        supportsSearch: state.ui.showSearchIcon,
    };
};

export default connect(
    mapStateToProps,
    { uiToggleDrawer },
)(MainAppBar);