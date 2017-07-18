// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import muiThemeable from 'material-ui/styles/muiThemeable';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import SkipPrevious from 'material-ui/svg-icons/av/skip-previous';
import SkipNext from 'material-ui/svg-icons/av/skip-next';

const getStyles = theme => {
    return {
        toolbar: {
            backgroundColor: theme.palette.primary1Color,
        },

        toolbarTitle: {
            color: theme.palette.alternateTextColor,
        },

        icon: {
            color: theme.palette.alternateTextColor,
        },
    };
};

class MonthPicker extends Component {

    static propTypes = {
        muiTheme: PropTypes.object.isRequired,

        month: PropTypes.object.isRequired,

        /** ('years' | 'months') => void */
        onSkipBack: PropTypes.func.isRequired,
        /** ('years' | 'months') => void */
        onSkipForward: PropTypes.func.isRequired,
    };

    render() {
        const { muiTheme } = this.props;
        const styles = getStyles(muiTheme);

        return (
            <Toolbar style={styles.toolbar}>
                <ToolbarGroup firstChild={true}>
                    <IconButton onTouchTap={() => this.props.onSkipBack('years')}>
                        <SkipPrevious style={styles.icon} />
                    </IconButton>

                    <IconButton onTouchTap={() => this.props.onSkipBack('months')}>
                        <ChevronLeft style={styles.icon} />
                    </IconButton>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarTitle
                        text={this.props.month.locale('de').format('MMMM YYYY')}
                        style={styles.toolbarTitle}
                    />
                </ToolbarGroup>

                <ToolbarGroup lastChild={true}>
                    <IconButton onTouchTap={() => this.props.onSkipForward('months')}>
                        <ChevronRight style={styles.icon} />
                    </IconButton>

                    <IconButton onTouchTap={() => this.props.onSkipForward('years')}>
                        <SkipNext style={styles.icon} />
                    </IconButton>
                </ToolbarGroup>
            </Toolbar>
        );
    }

}

export default muiThemeable()(MonthPicker);