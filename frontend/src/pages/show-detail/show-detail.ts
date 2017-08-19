import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ShowsProvider } from '../../providers/shows/shows';
import moment from 'moment';
import { CastItem, Show } from '../../models/models';
import { RolesProvider } from '../../providers/roles/roles';

@IonicPage({
    segment: 'shows/:location/:year/:month/:day/:time'
})
@Component({
    selector: 'page-show-detail',
    templateUrl: 'show-detail.html',
})
export class ShowDetailPage {

    show: Show;

    constructor(private navParams: NavParams,
                private showsProvider: ShowsProvider,
                public rolesProvider: RolesProvider) {
    }

    ionViewDidLoad() {
        const { location, year, month, day, time } = this.navParams.data;
        const date = moment(`${day}.${month}.${year} ${time}`, 'DD.MM.YYYY HHmm');

        this.showsProvider.fetchShow(date, location).subscribe(show => {
            this.show = show;
        });
    }

    getCastItemsForCategory(category: string): CastItem[] {
        return this.show.cast
            .filter(item => this.rolesProvider.getCategoryForRole(item.role) === category)
            .sort(this.rolesProvider.sortByRole.bind(this.rolesProvider));
    }

    formatTitle(): string {
        if (!this.show) {
            return 'Vorstellung';
        }

        return `${this.show.date.format('DD.MM.YYYY')} um ${this.show.date.format('HH:mm')}, ${this.show.production.location}`;
    }

    getLetterAvatar(castItem: CastItem): string {
        return castItem.person.name.toUpperCase().charAt(0);
    }

}
