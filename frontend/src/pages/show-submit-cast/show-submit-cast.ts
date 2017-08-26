import { Component, ViewChild } from '@angular/core';
import {
    AlertController, Content, IonicPage, LoadingController, NavController, NavParams, Searchbar,
    ToastController
} from 'ionic-angular';
import { RolesProvider } from '../../providers/roles/roles';
import { Actor, CastItem, Show } from '../../models/models';
import { ActorsProvider } from '../../providers/actors/actors';
import levenshtein from 'fast-levenshtein';
import { ShowsProvider } from '../../providers/shows/shows';
import moment, { Moment } from 'moment';
import { ProductionsProvider } from '../../providers/productions/productions';

@IonicPage({
    segment: 'shows/:location/:year/:month/:day/:time/submit'
})
@Component({
    selector: 'page-show-submit-cast',
    templateUrl: 'show-submit-cast.html',
})
export class ShowSubmitCastPage {

    @ViewChild(Content) content: Content;
    @ViewChild(Searchbar) searchBar: Searchbar;

    roleIndex: number = 0;
    roles: string[];

    /* Currently selected cast. */
    cast: Actor[][] = [];
    /* List of all actors. */
    actors: Actor[];
    /* Suggested actors (more likely). */
    suggestions: Actor[];

    searchText: string;
    filteredSuggestions: Actor[] = [];
    filteredActors: Actor[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public rolesProvider: RolesProvider,
                public actorsProvider: ActorsProvider,
                public productionsProvider: ProductionsProvider,
                public showsProvider: ShowsProvider) {

        this.roles = [ ...this.rolesProvider.getRoles() ];

        this.showsProvider.fetchShowBefore(this.getDateFromParams(), this.navParams.data.location).subscribe(previousShows => {
            const [ previousShow ] = previousShows;
            this.suggestions = previousShow.cast.map(item => {
                return { ...item.person, roles: [ item.role ] };
            });
            this.updateFilter();
        });

        this.actorsProvider.getListOfActors().subscribe(actors => {
            this.actors = actors;
            this.updateFilter();
        });
    }

    gotoPreviousRole(): void {
        this.roleIndex = Math.max(0, this.roleIndex - 1);
        this.onPageFlip();
    }

    gotoNextRole(): void {
        this.roleIndex = Math.min(this.roles.length - 1, this.roleIndex + 1);
        this.onPageFlip();
    }

    onPageFlip(): void {
        this.resetSearchBar();
        this.focusSearchBar();
        this.content.scrollToTop(0);
        this.content.resize();
    }

    toggleActor(actor: Actor): void {
        const idx = this.roleIndex;
        const selected = this.cast[ idx ] = this.cast[ idx ] || [];

        const foundIndex = selected.findIndex(p => p.name === actor.name);
        if (foundIndex !== -1) {
            selected.splice(foundIndex, 1);
        } else {
            selected.push(actor);
        }

        /* Updat the selected names. */
        this.cast[ idx ] = [ ...selected ];

        if (this.rolesProvider.isSingular(this.roles[ idx ]) && this.cast[ idx ].length === 1) {
            this.gotoNextRole();
        } else {
            /* Resize the content since the list of selected names an change appearance. */
            this.content.resize();
            /* Ensure to empty the current search text and re-filter. */
            this.resetSearchBar();
            /* Refocus in case the user clicked on the item by hand. */
            this.focusSearchBar();
        }
    }

    updateFilter(): void {
        this.filteredSuggestions = [ ...(this.suggestions || []) ]
            .filter(this.filterByRole.bind(this))
            .filter(this.filterByCurrentSearchText.bind(this))
            .filter(this.filterByAlreadySelected.bind(this));
        this.sortFilteredSuggestions();

        this.filteredActors = [ ...(this.actors || []) ]
            .filter(this.filterByConductor.bind(this))
            .filter(this.filterByCurrentSearchText.bind(this))
            .filter(this.filterByAlreadySelected.bind(this));
    }

    /**
     * The conductor is a special case. Show conductors exclusively if that's the current role and filter them out
     * for all other roles.
     */
    filterByConductor(actor: Actor): boolean {
        if (!actor.roles || actor.roles.length === 0) {
            return true;
        }

        const currentRole = this.roles[ this.roleIndex ];
        if (currentRole === 'Dirigent') {
            return actor.roles[ 0 ] === 'Dirigent';
        } else {
            return actor.roles[ 0 ] !== 'Dirigent';
        }
    }

    /**
     * For suggested actors, we only show those who have played the role.
     */
    filterByRole(actor: Actor): boolean {
        const currentRole = this.roles[ this.roleIndex ];
        return actor.roles.indexOf(currentRole) !== -1;
    }

    filterByCurrentSearchText(actor: Actor): boolean {
        if (!this.searchText || this.searchText.trim().length === 0) {
            return true;
        }

        const normalizedSearchText = this.normalize(this.searchText);
        const normalizedSuggestion = this.normalize(actor.name);
        if (normalizedSuggestion.includes(normalizedSearchText)) {
            return true;
        }

        return normalizedSearchText.length >= 3 && levenshtein.get(normalizedSearchText, normalizedSuggestion) <= 3;
    }

    sortFilteredSuggestions(): void {
        const currentRole = this.roles[ this.roleIndex ];
        this.filteredSuggestions.sort((left, right) => {
            return left.roles.indexOf(currentRole) < right.roles.indexOf(currentRole) ? 1 : -1;
        });
    }

    normalize(str: string): string {
        return str.toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    filterByAlreadySelected(actor: Actor): boolean {
        const selected = this.cast[ this.roleIndex ] = this.cast[ this.roleIndex ] || [];
        if (selected.length === 0) {
            return true;
        }

        const selectedNames = selected.map(p => p.name);
        return selectedNames.indexOf(actor.name) === -1;
    }

    onSearch(event: any): void {
        if (!this.searchText || this.searchText.trim().length === 0) {
            const selected = this.cast[ this.roleIndex ] || [];
            if (selected.length > 0) {
                this.gotoNextRole();
            }

            return;
        }

        this.toggleActor(this.filteredActors[ 0 ]);
        this.resetSearchBar();
    }

    resetSearchBar(): void {
        this.searchText = '';
        this.updateFilter();
    }

    focusSearchBar(): void {
        if (!this.searchBar) {
            return;
        }

        try {
            this.searchBar.setFocus();
        } catch (err) {
        }
    }

    getDateFromParams(): Moment {
        const { year, month, day, time } = this.navParams.data;
        return moment(`${day}.${month}.${year} ${time}`, 'DD.MM.YYYY HHmm', true);
    }

    showSuggestionsList(): boolean {
        if (!this.filteredSuggestions || this.filteredSuggestions.length === 0) {
            return false;
        }

        return true;
    }

    showEmptyFilterResultHeader(): boolean {
        return this.filteredActors
            && this.filteredActors.length === 0
            && this.searchText
            && this.searchText.length > 0;
    }

    showActorsHeader(): boolean {
        /* No point in showing it if we have no entries to show. */
        if (!this.filteredActors) {
            return false;
        }

        /* We don't need a header for the only category. */
        if (!this.showSuggestionsList()) {
            return false;
        }

        /* If a search text has been entered, but matches nothing, don't show the header. */
        if (this.filteredActors.length === 0 && this.searchText && this.searchText.length > 0) {
            return false;
        }

        return true;
    }

    showRoleBadge(actor: Actor): boolean {
        /* Never show the badge for conductors. */
        if (this.roles[ this.roleIndex ] === 'Dirigent') {
            return false;
        }

        return actor.roles && actor.roles.length > 0;
    }

    requestNavPop(): void {
        const confirm = this.alertCtrl.create({
            title: 'Eintrag abbrechen?',
            message: 'Möchtest du den Eintrag wirklich abbrechen und die eingegebenen Daten verwerfen?',
            buttons: [ { text: 'Nein' },
                {
                    text: 'Ja',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                }
            ]
        });

        confirm.present();
    }

    submitShow(): void {
        const castItems: CastItem[] = this.cast
            .map((group, i) => {
                const role = this.roles[ i ];
                return group.map((person: Actor): CastItem => {
                    return { role, person };
                });
            })
            .reduce((acc, value) => {
                return [...acc, ...value];
            }, []);

        const loader = this.loadingCtrl.create({ content: 'Bitte warten…' });
        loader.present();

        const date = this.getDateFromParams();
        this.productionsProvider.getProduction(date, this.navParams.data.location).subscribe(
            production => {
                const show: Show = { date, production, cast: castItems };

                // TODO also send to Github or email

                this.showsProvider.postShow(show).subscribe(
                    response => {
                        this.showToast('Die Vorstellung wurde erfogreich eingetragen.');
                        this.navCtrl.popToRoot();

                        loader.dismiss();
                    }, err => {
                        console.error(err);

                        loader.dismiss();
                        this.showToast('Ein Fehler ist aufgetreten.');
                    });
            },
            err => {
                console.error(err);

                loader.dismiss();
                this.showToast('Ein Fehler ist aufgetreten.');
            }
        );
    }

    showToast(message: string): void {
        const toast = this.toastCtrl.create({
            message,
            duration: 3000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
            dismissOnPageChange: false,
        });

        toast.present();
    }

}
