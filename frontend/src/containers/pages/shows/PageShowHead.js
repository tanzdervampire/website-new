// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uiChangeShowListDate, uiResetShowListDate } from '../../../actions/';

import MonthPicker from '../../../components/month-picker/MonthPicker';

class PageShowHead extends Component {

    componentWillUnmount() {
        this.props.uiResetShowListDate();
    }

    render() {
        return (
            <MonthPicker
                month={this.props.month}
                onSkipBack={unit => this.props.uiChangeShowListDate(unit, -1)}
                onSkipForward={unit => this.props.uiChangeShowListDate(unit, 1)}
            />
        );
    }

}

const mapStateToProps = state => {
    return {
        month: state.ui.showListDate,
    };
};

export default connect(
    mapStateToProps,
    { uiChangeShowListDate, uiResetShowListDate },
)(PageShowHead);