// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import muiThemeable from 'material-ui/styles/muiThemeable';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { transparent } from 'material-ui/styles/colors';

// TODO FIXME Display dates with no entry with a "+" button?
// TODO FIXME Deal with empty months
class ShowList extends Component {

    static propTypes = {
        muiTheme: PropTypes.object.isRequired,

        /**
         * {
         *  date: PropTypes.object.isRequired,
         *  location: PropTypes.str.isRequired,
         *  ...
         * }
         */
        items: PropTypes.array.isRequired,

        /** (item) => void */
        onShowClick: PropTypes.func,
    };

    static defaultProps = {
        onShowClick: () => {},
    };

    groupItemsByDay(items) {
        const format = 'DD-MM-YYYY';
        // Create a unique, sorted array of all appearing dates.
        const buckets = Array.from(new Set(items.map(item => item.date)))
            .sort((a, b) => a.diff(b))
            .map(date => date.format(format));

        return items
            .sort((a, b) => a.date.diff(b.date))
            .reduce((acc, item) => {
                const bucket = buckets.indexOf(item.date.format(format));
                (acc[ bucket ] = acc[ bucket ] || []).push(item);

                return acc;
            }, []);
    }

    renderDivider(key) {
        return (<Divider key={key} inset={true} />);
    }

    renderDayAvatar(date) {
        const { muiTheme } = this.props;
        return (
            <Avatar color={muiTheme.palette.primary1Color} backgroundColor={transparent}>
                <h2>{date.format('D')}.</h2>
            </Avatar>
        );
    }

    renderWeekdayAvatar(date) {
        const { muiTheme } = this.props;
        return (
            <Avatar color={muiTheme.palette.accent1Color} backgroundColor={transparent}>
                {date.locale('de').format('dd')}
            </Avatar>
        );
    }

    renderItem(item, idx) {
        const key = `item-${item.date.format('DDMMYYYY')}-${idx}`;

        const firstItemOfDay = idx === 0;
        const leftAvatar = firstItemOfDay ? this.renderDayAvatar(item.date) : null;
        const rightAvatar = firstItemOfDay ? this.renderWeekdayAvatar(item.date) : null;

        return (
            <ListItem
                key={key}
                primaryText={`${item.date.format('HH:mm')} Uhr`}
                secondaryText={item.location}
                insetChildren={!firstItemOfDay}
                leftAvatar={leftAvatar}
                rightAvatar={rightAvatar}
                onTouchTap={() => this.props.onShowClick(item)}
            />
        );
    }

    renderItemsByDay(items) {
        if (!items || items.length === 0) {
            return null;
        }

        const key = `divider-${items[0].date.format('DDMMYYYY')}`;
        return [
            ...items.map(this.renderItem.bind(this)),
            this.renderDivider(key),
        ];
    }

    renderItems() {
        const { items } = this.props;
        return this.groupItemsByDay(items)
            .map(this.renderItemsByDay.bind(this));
    }

    render() {
        return (
            <List>
                { this.renderItems() }
            </List>
        );
    }

}

export default muiThemeable()(ShowList);