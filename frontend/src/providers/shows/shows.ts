import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import moment, { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { Show } from '../../models/models';

interface QueryParameters {
    location?: string;
    fields?: ['production' | 'cast'];
    count?: boolean;
}

interface ShowEndpointParameters {
    year: string;
    month: string;
    day?: string;
    params?: QueryParameters;
}

@Injectable()
export class ShowsProvider {

    constructor(private http: Http) {
    }

    fetchLatestMonth(beforeDate?: Moment): Observable<Show[]> {
        const before = beforeDate ? beforeDate.format('YYYY-MM-DD') : '';
        return this.http.get(`/api/shows/by-month/latest?fields=production,cast&before=${before}`)
            .map(response => response.json())
            .map(this.momentify);
    }

    fetchShowsForMonth(date: Moment): Observable<Show[]> {
        const year = date.format('YYYY');
        const month = date.format('MM');

        const params: QueryParameters = { fields: ['production', 'cast'] };
        return this.fetchShows({ year, month, params });
    }

    fetchShow(date: Moment, location?: string): Observable<Show> {
        const year = date.format('YYYY');
        const month = date.format('MM');
        const day = date.format('DD');

        const params: QueryParameters = { location, fields: [ 'production', 'cast' ] };
        return this.fetchShows({ year, month, day, params })
            .map((shows: Show[]): Show => {
                return shows.find(show => date.isSame(show.date));
            });
    }

    fetchShows(args: ShowEndpointParameters): Observable<Show[]> {
        let url = `/api/shows/${args.year}/${args.month}`;
        if (args.day) {
            url += `/${args.day}`;
        }

        if (args.params) {
            url += '?' + this.convertParams(args.params);
        }

        return this.http.get(url)
            .map(response => response.json())
            .map(this.momentify);
    }

    convertParams(params: QueryParameters): string {
        let url = '';
        if (params.location) {
            url += 'location=' + params.location + '&';
        }
        if (params.fields) {
            url += 'fields=' + params.fields.join(',') + '&';
        }
        if (params.count) {
            url += 'count=true&';
        }

        return url;
    }

    momentify(rawShows: any[]): Show[] {
        return rawShows.map(rawShow => {
            const show = { ...rawShow };
            show.date = moment(show.date);
            show.production.start = moment(show.production.start);
            show.production.end = moment(show.production.end);
            return show;
        });
    }

}
