import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { CastItem } from '../../models/models';

interface RoleDefinition {
    name: string;
    category: string;
    primary: boolean;
    index: number;
    singular: boolean;
}

@Injectable()
export class RolesProvider {

    private _config: RoleDefinition[] = [
        { name: 'Graf von Krolock', category: 'Hauptrollen', primary: true, index: 1, singular: true },
        { name: 'Sarah', category: 'Hauptrollen', primary: true, index: 2, singular: true },
        { name: 'Alfred', category: 'Hauptrollen', primary: true, index: 3, singular: true },
        { name: 'Professor Abronsius', category: 'Hauptrollen', primary: true, index: 4, singular: true },
        { name: 'Chagal', category: 'Hauptrollen', primary: true, index: 5, singular: true },
        { name: 'Magda', category: 'Hauptrollen', primary: true, index: 6, singular: true },
        { name: 'Herbert', category: 'Hauptrollen', primary: true, index: 7, singular: true },
        { name: 'Rebecca', category: 'Hauptrollen', primary: true, index: 8, singular: true },
        { name: 'Koukol', category: 'Hauptrollen', primary: true, index: 9, singular: true },
        { name: 'Tanzsolisten', category: 'Tanzsolisten', primary: false, index: 10, singular: false },
        { name: 'Gesangssolisten', category: 'Gesangssolisten', primary: false, index: 11, singular: false },
        { name: 'Tanzensemble', category: 'Tanzensemble', primary: false, index: 12, singular: false },
        { name: 'Gesangsensemble', category: 'Gesangsensemble', primary: false, index: 13, singular: false },
        { name: 'Dirigent', category: 'Dirigent', primary: false, index: 14, singular: true },
    ];

    private _roles: string[];
    private _primaryRoles: string[];
    private _singularRoles: string[];
    private _nameToIndex: any;
    private _categories: string[];
    private _nameToCategory: any;

    constructor() {
        this._nameToIndex = this._config
            .reduce((acc, definition) => {
                return { ...acc, [definition.name]: definition.index };
            }, {});

        this._roles = this._config
            .map(entry => entry.name)
            .sort(this.sortByRole.bind(this));
        this._primaryRoles = this._config
            .filter(entry => entry.primary)
            .map(entry => entry.name)
            .sort(this.sortByRole.bind(this));
        this._singularRoles = this._config
            .filter(entry => entry.singular)
            .map(entry => entry.name)
            .sort(this.sortByRole.bind(this));

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
        return [...this._roles];
    }

    getPrimaryRoles(): string[] {
        return [...this._primaryRoles];
    }

    getRoleCategories(): string[] {
        return [...this._categories];
    }

    getCategoryForRole(role: string): string {
        return this._nameToCategory[role];
    }

    isPrimary(role: string): boolean {
        return this._primaryRoles.indexOf(role) !== -1;
    }

    isSingular(role: string): boolean {
        return this._singularRoles.indexOf(role) !== -1;
    }

    sortCastItemByRole(left: CastItem, right: CastItem): number {
        return this.sortByRole(left.role, right.role);
    }

    sortByRole(left: string, right: string): number {
        return this._nameToIndex[left] - this._nameToIndex[right];
    }

}
