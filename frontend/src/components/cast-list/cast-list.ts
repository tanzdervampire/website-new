import { Component, Input } from '@angular/core';
import { CastItem } from '../../models/models';
import { RolesProvider } from '../../providers/roles/roles';

@Component({
    selector: 'cast-list',
    templateUrl: 'cast-list.html'
})
export class CastListComponent {

    @Input() cast: CastItem[];
    categories: string[];

    constructor(
        public rolesProvider: RolesProvider
    ) {
        this.categories = [...this.rolesProvider.getRoleCategories()];
    }

    getCastItemsForCategory(category: string): CastItem[] {
        return this.cast
            .filter(item => this.filterByCategory(item, category))
            .sort(this.rolesProvider.sortCastItemByRole.bind(this.rolesProvider));
    }

    filterByCategory(item: CastItem, category: string): boolean {
        return this.rolesProvider.getCategoryForRole(item.role) === category;
    }

    getLetterAvatar(castItem: CastItem): string {
        return castItem.person.name.charAt(0).toUpperCase();
    }

    doesIncludeRole(item: CastItem): boolean {
        return this.rolesProvider.isPrimary(item.role);
    }

}
