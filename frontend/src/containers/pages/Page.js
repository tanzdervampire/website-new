// @flow

import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uiSetTitle, uiInvalidateTitle, uiShowSearchIcon } from '../../actions';

/**
 * This is a higher-order component to wrap high-level pages.
 * This component allows controlling some application-wide information such as the title.
 */
class Page extends Component {

    static propTypes = {
        title: PropTypes.string,
        supportsSearch: PropTypes.bool,
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

    render() {
        return this.props.children;
    }

}

export default connect(
    null,
    { uiSetTitle, uiInvalidateTitle, uiShowSearchIcon },
)(Page);