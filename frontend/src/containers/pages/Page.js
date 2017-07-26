// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uiSetTitle, uiInvalidateTitle, uiShowSearchIcon } from '../../actions';

import spacing from 'material-ui/styles/spacing';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const getStyles = () => {
    return {
        fab: {
            zIndex: 1,
            position: 'fixed',
            bottom: spacing.desktopGutterLess,
            right: spacing.desktopGutterLess,
        },
    };
};

/**
 * This is a higher-order component to wrap high-level pages.
 * This component allows controlling some application-wide information such as the title.
 */
class Page extends Component {

    static propTypes = {
        title: PropTypes.string,
        supportsSearch: PropTypes.bool,
        fab: PropTypes.bool,
    };

    static defaultProps = {
        title: null,
        supportsSearch: false,
    };

    componentWillMount() {
        const { title, supportsSearch } = this.props;
        this.props.uiSetTitle(title);
        this.props.uiShowSearchIcon(supportsSearch);
    }

    componentWillUnmount() {
        const { title } = this.props;
        this.props.uiInvalidateTitle(title);
        this.props.uiShowSearchIcon(false);
    }

    renderFab() {
        const styles = getStyles();
        /* TODO FIXME Turn into »scroll up« button (secondary?) when scrolled */
        return (
            <FloatingActionButton style={styles.fab}>
                <ContentAdd />
            </FloatingActionButton>
        );
    }

    render() {
        return (
            <div>
                {this.props.children}

                {this.props.fab && this.renderFab()}
            </div>
        );
    }

}

export default connect(
    null,
    { uiSetTitle, uiInvalidateTitle, uiShowSearchIcon },
)(Page);