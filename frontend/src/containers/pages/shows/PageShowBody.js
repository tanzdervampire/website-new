// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from '../Page';

import ShowList from '../../../components/show-list/ShowList';

class PageShowBody extends Component {

    getFakeItems() {
        const toItem = (day, hour, minute) => {
            const date = day.clone().set({ hour, minute });
            return {
                date,
                location: 'Palladium, Stuttgart',
            };
        };

        let items = [];
        for (let i = 1; i <= this.props.month.daysInMonth(); i++) {
            const current = this.props.month.clone().date(i);
            if (current.day() === 1) {
                continue;
            }

            items.push(toItem(current, 19, 30));
            if (current.day() === 0 || current.day() === 6) {
                items.push(toItem(current, 14, 30));
            }
        }

        return items;
    }

    render() {
        return (
            <Page title="Vorstellungen">
                <ShowList
                    items={this.getFakeItems()}
                />
            </Page>
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
)(PageShowBody);