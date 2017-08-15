import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalController, Refresher } from 'ionic-angular';

import { Actor, ActorFilters, ActorsProvider } from '../../providers/actors/actors';
import { ActorListFilter } from './actor-list-filter';
import { RolesProvider } from '../../providers/roles/roles';

@Component({
    selector: 'page-actor-list',
    templateUrl: 'actor-list.html',
    animations: [
        trigger(
            'toggleSearchBar', [
                transition(':enter', [
                    style({ transform: 'translateY(-100%)' }),
                    animate('0.225s', style({ transform: 'translateY(0)' })),
                ]),
            ]
        )
    ],
})
export class ActorListPage {

    actors: Actor[];

    showSearchBar: boolean;
    searchText: string;
    rolesFilter: string[];

    constructor(
        public actorsProvider: ActorsProvider,
        public rolesProvider: RolesProvider,
        public modalCtrl: ModalController) {
    }

    ionViewDidLoad() {
        this.rolesFilter = [...this.rolesProvider.roles];
        this.updateActors();
    }

    toggleSearchBar(show:boolean = undefined) {
        this.showSearchBar = (typeof show === 'undefined') ? !this.showSearchBar : show;

        if (!this.showSearchBar) {
            this.searchText = '';
            this.updateActors();
        }
    }

    onSearchBarBlur() {
        if (this.searchText && this.searchText.length !== 0) {
            return;
        }

        this.toggleSearchBar(false);
    }

    onShowFilter() {
        const modal = this.modalCtrl.create(ActorListFilter, { selectedRoles: [...this.rolesFilter] });
        modal.onDidDismiss(newFilter => {
            this.rolesFilter = newFilter === null ? this.rolesFilter : newFilter;
            this.updateActors();
        });

        modal.present();
    }

    onAddNewPerson() {}

    updateActors(refresher?: Refresher) {
        /* Force a refresh from the database if the user pulled to refresh. */
        const forceRefresh = !!refresher;

        const filter: ActorFilters = {
            contains: this.searchText,
            roles: this.rolesFilter,
        };

        return this.actorsProvider.getListOfActors(forceRefresh, filter)
            .subscribe(data => {
                this.actors = data;

                if (refresher) {
                    refresher.complete();
                }
            });
    }

}
