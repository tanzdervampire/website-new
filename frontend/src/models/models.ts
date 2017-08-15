import { Moment } from 'moment';

export interface Production {
    _id: string;
    location: string;
    theater: string;
    start: Moment;
    end: Moment;
}

export interface CastItem {
    role: string;
    person: Actor;
}

export interface ShowBase {
    _id: string;
    date: Moment;
}

export interface Show extends ShowBase {
    production: Production;
    cast: CastItem[];
}

export interface Actor {
    _id: string;
    name: string;
    roles: string[];
}
