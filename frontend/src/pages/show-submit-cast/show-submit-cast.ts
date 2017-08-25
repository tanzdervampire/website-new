import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
import { RolesProvider } from '../../providers/roles/roles';
import { Actor } from '../../models/models';
import { ActorsProvider } from '../../providers/actors/actors';
import levenshtein from 'fast-levenshtein';

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
    cast: Actor[][] = [];
    suggestions: Actor[][];

    searchText: string;
    currentSuggestions: Actor[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public rolesProvider: RolesProvider,
                public actorsProvider: ActorsProvider) {

        this.roles = [...this.rolesProvider.getRoles()];

        this.actorsProvider.getListOfActors().subscribe(actors => {
            this.suggestions = [];
            this.roles.forEach((_, i) => {
                this.suggestions[i] = [...actors];
            });

            this.updateCurrentSuggestions();
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
        const selected = this.cast[this.roleIndex] = this.cast[this.roleIndex] || [];

        const foundIndex = selected.findIndex(p => p.name === actor.name);
        if (foundIndex !== -1) {
            selected.splice(foundIndex, 1);
        } else {
            selected.push(actor);
        }

        /* Updat the selected names. */
        this.cast[this.roleIndex] = [...selected];

        if (this.rolesProvider.isSingular(this.roles[ this.roleIndex ])) {
            this.gotoNextRole();
        } else {
            /* Resize the content since the list of selected names an change appearance. */
            this.content.resize();
            /* Refocus in case the user clicked on the item by hand. */
            this.focusSearchBar();
        }
    }

    updateCurrentSuggestions(): void {
        this.currentSuggestions = [...this.suggestions[this.roleIndex]]
            .filter(this.filterByCurrentSearchText.bind(this))
            .filter(this.filterByAlreadySelected.bind(this));
    }

    filterByCurrentSearchText(suggestion: Actor): boolean {
        if (!this.searchText || this.searchText.trim().length === 0) {
            return true;
        }

        const normalizedSearchText = this.normalize(this.searchText);
        const normalizedSuggestion = this.normalize(suggestion.name);
        if (normalizedSuggestion.includes(normalizedSearchText)) {
            return true;
        }

        return normalizedSearchText.length >= 3 && levenshtein.get(normalizedSearchText, normalizedSuggestion) <= 3;
    }

    normalize(str: string): string {
        return str.toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, "");
    }

    filterByAlreadySelected(suggestion: Actor): boolean {
        const selected = this.cast[this.roleIndex] = this.cast[this.roleIndex] || [];
        if (selected.length === 0) {
            return true;
        }

        const selectedNames = selected.map(p => p.name);
        return selectedNames.indexOf(suggestion.name) === -1;
    }

    onSearch(event: any): void {
        if (!this.searchText || this.searchText.trim().length === 0) {
            const selected = this.cast[this.roleIndex] || [];
            if (selected.length > 0) {
                this.gotoNextRole();
            }

            return;
        }

        this.toggleActor(this.currentSuggestions[0]);
        this.resetSearchBar();
    }

    resetSearchBar(): void {
        this.searchText = '';
        this.updateCurrentSuggestions();
    }

    focusSearchBar(): void {
        if (!this.searchBar) {
            return;
        }

        try {
            this.searchBar.setFocus();
        } catch (err) {}
    }

}
