import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Production } from '../../models/models';
import { Observable } from 'rxjs/Observable';
import moment, { Moment } from 'moment';

@Injectable()
export class ProductionsProvider {

    private _cache: Production[];

    constructor(public http: Http) {
    }

    load(force: boolean = false): Observable<Production[]> {
        if (!this._cache || force) {
            const request = this.http.get('/api/productions')
                .map(response => response.json())
                .map(this.momentify);

            request.subscribe(response => { this._cache = response; });
            return request;
        }

        return Observable.of(this._cache);
    }

    getProductions(): Observable<Production[]> {
        return this.load();
    }

    getProductionsFor(date: Moment): Observable<Production[]> {
        return this.getProductions()
            .map((productions: Production[]) => {
                return productions.filter(production => {
                    return date.isBetween(production.start, production.end, 'day', '[]');
                });
            });
    }

    getProduction(date: Moment, location: string): Observable<Production> {
        return this.getProductionsFor(date)
            .map((productions: Production[]): Production => {
                return productions
                    .filter(production => production.location === location)
                    [0];
            });
    }

    momentify(rawProductions: any[]): Production[] {
        return rawProductions.map(rawProduction => {
            const production = { ...rawProduction };
            production.start = moment.utc(production.start);
            production.end = moment.utc(production.end);
            return production;
        });
    }

}
