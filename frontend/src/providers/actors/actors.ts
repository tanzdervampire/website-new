import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { Http } from '@angular/http';
import { Actor } from '../../models/models';

export interface ActorFilters {
    contains?: string;
    roles?: string[];
}

@Injectable()
export class ActorsProvider {

    private _cache: Actor[];

    constructor(private http: Http) {
    }

    load(force: boolean = false): Observable<Actor[]> {
        if (!this._cache || force) {
            const request = this.http.get('/api/persons?fields=roles')
                .map(response => response.json());

            request.subscribe(response => { this._cache = response; });
            return request;
        }

        return Observable.of(this._cache);
    }

    getListOfActors(force: boolean = false, filter: ActorFilters = {}): Observable<Actor[]> {
        return this.load().map((actors: Actor[]) => {
            return actors
                .filter(actor => {
                    if (!filter.contains) {
                        return true;
                    }

                    return actor.name.toLowerCase().includes(filter.contains.toLowerCase());
                })
                .filter(actor => {
                    if (filter.roles === undefined || filter.roles === null) {
                        return true;
                    }

                    return actor.roles.some(
                        role => filter.roles.indexOf(role) !== -1
                    );
                });
        });
    }

}
