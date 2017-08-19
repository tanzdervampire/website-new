import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { CastItem } from '../../models/models';

interface RoleDefinition {
    name: string;
    category: string;
    primary: boolean;
    index: number;
}

@Injectable()
export class RolesProvider {

    private _config: RoleDefinition[] = [
        { name: 'Graf von Krolock', category: 'Hauptrollen', primary: true, index: 1 },
        { name: 'Sarah', category: 'Hauptrollen', primary: true, index: 2 },
        { name: 'Alfred', category: 'Hauptrollen', primary: true, index: 3 },
        { name: 'Professor Abronsius', category: 'Hauptrollen', primary: true, index: 4 },
        { name: 'Chagal', category: 'Hauptrollen', primary: true, index: 5 },
        { name: 'Magda', category: 'Hauptrollen', primary: true, index: 6 },
        { name: 'Herbert', category: 'Hauptrollen', primary: true, index: 7 },
        { name: 'Rebecca', category: 'Hauptrollen', primary: true, index: 8 },
        { name: 'Koukol', category: 'Hauptrollen', primary: true, index: 9 },
        { name: 'Tanzsolisten', category: 'Tanzsolisten', primary: false, index: 10 },
        { name: 'Gesangssolisten', category: 'Gesangssolisten', primary: false, index: 11 },
        { name: 'Tanzensemble', category: 'Tanzensemble', primary: false, index: 12 },
        { name: 'Gesangsensemble', category: 'Gesangsensemble', primary: false, index: 13 },
        { name: 'Dirigent', category: 'Dirigent', primary: false, index: 14 },
    ];

    private _roles: string[];
    private _primaryRoles: string[];
    private _nameToIndex: any;
    private _categories: string[];
    private _nameToCategory: any;

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

        this._categories = this._config
            .map(entry => entry.category);
        this._categories = this._categories
            .filter((entry, i) => this._categories.lastIndexOf(entry) === i);

        this._nameToCategory = this._config
            .reduce((acc, definition) => {
                return { ...acc, [definition.name]: definition.category };
            }, {});
    }

    getRoles(): string[] {
        return this._roles;
    }

    getPrimaryRoles(): string[] {
        return this._primaryRoles;
    }

    getRoleCategories(): string[] {
        return this._categories;
    }

    getCategoryForRole(role: string): string {
        return this._nameToCategory[role];
    }

    isPrimary(role: string): boolean {
        return this._primaryRoles.indexOf(role) !== -1;
    }

    sortByRole(left: CastItem, right: CastItem): number {
        return this._nameToIndex[left.role] - this._nameToIndex[right.role];
    }

}
