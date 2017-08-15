import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import moment, { Moment } from 'moment';
import { Observable } from 'rxjs/Observable';
import { Show } from '../../models/models';

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

        return this.http.get(`/api/shows/${year}/${month}?fields=production,cast`)
            .map(response => response.json())
            .map(this.momentify);
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
