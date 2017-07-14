// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { increment } from './actions';

class App extends Component {

    static propTypes = {
        count: PropTypes.number,
        onClick: PropTypes.func,
    };

    handleClick = event => {
        event.preventDefault();
        this.props.onClick();
    };

    render() {
        return (
            <div>
                <p>Hello, World!</p>
                <p>{this.props.count}</p>
                <input type="button" onClick={this.handleClick} value="Increment!"/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        count: state.count,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onClick: () => {
            dispatch(increment());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);