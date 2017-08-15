import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { RolesProvider } from '../../providers/roles/roles';

@Component({
    templateUrl: 'actor-list-filter.html',
})
export class ActorListFilter {

    selected: string[];

    constructor(
        public viewCtrl: ViewController,
        public rolesProvider: RolesProvider,
        public params: NavParams
    ) {
        this.selected = this.params.get('selectedRoles');
    }

    isChecked(role: string): boolean {
        return this.selected.indexOf(role) !== -1;
    }

    toggle(role: string): void {
        const idx = this.selected.indexOf(role);
        if (idx === -1) {
            this.selected.push(role);
        } else {
            this.selected.splice(idx, 1);
        }
    }

    dismiss(submit: boolean) {
        this.viewCtrl.dismiss(submit ? this.selected : null);
    }

}
