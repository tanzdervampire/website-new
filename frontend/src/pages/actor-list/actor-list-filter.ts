import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { RolesProvider } from '../../providers/roles/roles';

interface RoleItem {
    name: string;
    selected: boolean;
}

@Component({
    templateUrl: 'actor-list-filter.html',
})
export class ActorListFilter {

    roles: RoleItem[];
    private onChange: (selectedRoles: string[]) => void;

    constructor(
        public viewCtrl: ViewController,
        public rolesProvider: RolesProvider,
        public params: NavParams
    ) {
        this.onChange = this.params.data.onChange;

        const selected = this.params.data.selectedRoles;
        this.roles = this.rolesProvider.getRoles()
            .map(role => {
                return {
                    name: role,
                    selected: selected.includes(role),
                };
            });
    }

    selectAll(): void {
        this.roles = this.roles.map(entry => {
            return { ...entry, selected: true };
        });

        this.triggerChange();
    }

    selectNone(): void {
        this.roles = this.roles.map(entry => {
            return { ...entry, selected: false };
        });

        this.triggerChange();
    }

    toggle(role: RoleItem): void {
        role.selected = !role.selected;
        this.triggerChange();
    }

    triggerChange() {
        const selected = this.roles
            .filter(entry => entry.selected)
            .map(entry => entry.name);

        this.onChange(selected);
    }

}
