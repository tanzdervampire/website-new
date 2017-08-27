import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { PopoverController, Refresher } from 'ionic-angular';

import { ActorFilters, ActorsProvider } from '../../providers/actors/actors';
import { ActorListFilter } from './actor-list-filter';
import { RolesProvider } from '../../providers/roles/roles';
import { Actor } from '../../models/models';

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
        public popoverCtrl: PopoverController) {
    }

    ionViewDidLoad() {
        this.rolesFilter = [...this.rolesProvider.getRoles()];
        this.updateActors();
    }

    toggleSearchBar(event?: any, show:boolean = undefined) {
        if (event) {
            event.preventDefault();
        }

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

        this.toggleSearchBar(null, false);
    }

    onShowFilter(event: any) {
        event.preventDefault();
        const modal = this.popoverCtrl.create(ActorListFilter, {
            selectedRoles: [...this.rolesFilter],
            onChange: (selectedRoles) => {
                this.rolesFilter = selectedRoles;
                this.updateActors();
            }
        });

        modal.present({ ev: event });
    }

    onAddNewPerson(event: any) {
        event.preventDefault();
    }

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
