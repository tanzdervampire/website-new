// @flow

import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { connect } from 'react-redux';
import moment from 'moment';
import Page from '../Page';
import { showsFetchMonth } from '../../../actions';

import { CircularProgress } from 'material-ui-next/Progress';
import ShowList from '../../../components/show-list/ShowList';
import IconButton from 'material-ui/IconButton';
import Refresh from 'material-ui/svg-icons/navigation/refresh';

const getStyles = theme => {
    return {
        centerContainer: {
            /*width: '100%',
             position: 'absolute',
             top: '50%',
             textAlign: 'center',*/
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        refreshIcon: {
            width: 48,
            height: 48,
        },
        refreshButton: {
            width: 72,
            height: 72,
        },
    };
};

class PageShowsBody extends Component {

    componentDidMount() {
        this.fetchShowsForCurrentMonth();
    }

    componentWillReceiveProps({ month: nextMonth }) {
        const { month } = this.props;
        if (!month.isSame(nextMonth, 'month')) {
            this.fetchShows(nextMonth);
        }
    }

    fetchShowsForCurrentMonth = () => {
        this.fetchShows(this.props.month);
    };

    fetchShows(month) {
        this.props.showsFetchMonth(month);
    }

    convertShowsToItems(data) {
        return data.map(show => {
            return {
                date: moment(show.date),
                location: show.production.location,
            };
        });
    }

    renderPage(children) {
        return (
            <Page title="Vorstellungen" supportsSearch>
                {children}
            </Page>
        );
    }

    render() {
        const { shows, isFetchInProgress, hasFetchErrored } = this.props.shows;
        const styles = getStyles(this.props.muiTheme);

        if (isFetchInProgress) {
            return this.renderPage((
                <div style={styles.centerContainer}>
                    <CircularProgress size={50} />
                </div>
            ));
        }

        if (hasFetchErrored) {
            return this.renderPage((
                <div style={styles.centerContainer}>
                    <IconButton style={styles.refreshButton} iconStyle={styles.refreshIcon} onTouchTap={this.fetchShowsForCurrentMonth}>
                        <Refresh />
                    </IconButton>
                    <p>Erneut versuchen</p>
                </div>
            ));
        }

        if (shows.length === 0) {
            return this.renderPage((
                <div style={styles.centerContainer}>
                    <p>Keine Einträge gefunden</p>
                </div>
            ));
        }

        return this.renderPage((
            <ShowList
                items={this.convertShowsToItems(shows)}
            />
        ));
    }

}

const mapStateToProps = state => {
    return {
        month: state.ui.showListDate,
        shows: state.shows,
    };
};

export default connect(
    mapStateToProps,
    { showsFetchMonth },
)(muiThemeable()(PageShowsBody));