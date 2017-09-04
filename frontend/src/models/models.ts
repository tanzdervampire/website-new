import { Moment } from 'moment';

export type Role = 'Graf von Krolock' | 'Sarah' | 'Alfred' | 'Professor Abronsius' | 'Chagal' | 'Magda' | 'Herbert' | 'Rebecca' | 'Koukol' | 'Tanzsolisten' | 'Gesangssolisten' | 'Tanzensemble' | 'Gesangsensemble' | 'Dirigent';
export type MongoID = string;

export interface Production {
    _id?: MongoID;
    location: string;
    theater: string;
    start: Moment;
    end: Moment;
}

export interface CastItem {
    role: Role;
    person: Actor;
}

export interface ShowBase {
    _id?: MongoID;
    date: Moment;
}

export interface Show extends ShowBase {
    production: Production;
    cast: CastItem[];
}

export interface Actor {
    _id?: MongoID;
    name: string;
    roles?: string[];
}

export interface OcrCastItem {
    role: Role;
    name: string;
}
