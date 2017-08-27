import { Moment } from 'moment';

type MongoID = string;

export interface Production {
    _id?: MongoID;
    location: string;
    theater: string;
    start: Moment;
    end: Moment;
}

export interface CastItem {
    role: string;
    person: Actor;
}

export interface RawCastItem {
    role: string;
    person: MongoID;
}

export interface ShowBase {
    _id?: MongoID;
    date: Moment;
}

export interface Show extends ShowBase {
    production: Production;
    cast: CastItem[];
}

export interface RawShow extends ShowBase {
    production: MongoID;
    cast: RawCastItem[];
}

export interface Actor {
    _id?: MongoID;
    name: string;
    roles?: string[];
}
