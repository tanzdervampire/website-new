// @flow

export const SHOWS_FETCH_HAS_STARTED = 'SHOWS_FETCH_HAS_STARTED';
export const SHOWS_FETCH_SUCCESS = 'SHOWS_FETCH_SUCCESS';
export const SHOWS_FETCH_ERROR = 'SHOWS_FETCH_ERROR';

export function showsFetchHasStarted() {
    return { type: SHOWS_FETCH_HAS_STARTED };
}

export function showsFetchSuccess(shows) {
    return { type: SHOWS_FETCH_SUCCESS, shows };
}

export function showsFetchError(err) {
    return { type: SHOWS_FETCH_ERROR, err };
}

export function showsFetchMonth(date) {
    const year = date.format('YYYY');
    const month = date.format('MM');

    return dispatch => {
        dispatch(showsFetchHasStarted());

        fetch(`/api/shows/${year}/${month}?fields=cast,production`, { accept: 'application/json' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
            .then(data => { dispatch(showsFetchSuccess(data)); })
            .catch(err => {
                console.error(err);
                dispatch(showsFetchError(err));
            });
    };
};