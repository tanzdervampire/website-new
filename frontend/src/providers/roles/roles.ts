import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { CastItem } from '../../models/models';

interface RoleDefinition {
    name: string;
    primary: boolean;
    index: number;
}

@Injectable()
export class RolesProvider {

    private _config: RoleDefinition[] = [
        { name: 'Graf von Krolock', primary: true, index: 1 },
        { name: 'Sarah', primary: true, index: 2 },
        { name: 'Alfred', primary: true, index: 3 },
        { name: 'Professor Abronsius', primary: true, index: 4 },
        { name: 'Chagal', primary: true, index: 5 },
        { name: 'Magda', primary: true, index: 6 },
        { name: 'Herbert', primary: true, index: 7 },
        { name: 'Rebecca', primary: true, index: 8 },
        { name: 'Koukol', primary: true, index: 9 },
        { name: 'Tanzsolisten', primary: false, index: 10 },
        { name: 'Gesangssolisten', primary: false, index: 11 },
        { name: 'Tanzensemble', primary: false, index: 12 },
        { name: 'Gesangsensemble', primary: false, index: 13 },
        { name: 'Dirigent', primary: false, index: 14 },
    ];

    private _roles: string[];
    private _primaryRoles: string[];
    private _nameToIndex: any;

    constructor() {
        this._roles = this._config
            .map(entry => entry.name);
        this._primaryRoles = this._config
            .filter(entry => entry.primary)
            .map(entry => entry.name);

        this._nameToIndex = this._config
            .reduce((acc, definition) => {
                return { ...acc, [definition.name]: definition.index };
            }, {});
    }

    getRoles(): string[] {
        return this._roles;
    }

    getPrimaryRoles(): string[] {
        return this._primaryRoles;
    }

    isPrimary(role: string): boolean {
        return this._primaryRoles.indexOf(role) !== -1;
    }

    sortByRole(left: CastItem, right: CastItem): number {
        return this._nameToIndex[left.role] - this._nameToIndex[right.role];
    }

}
