import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ShowsProvider } from '../../providers/shows/shows';
import moment, { Moment } from 'moment';
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
        const { location } = this.navParams.data;
        const date = this.getDateFromParams();

        this.showsProvider.fetchShow(date, location).subscribe(show => {
            this.show = show;
        });
    }

    getCastItemsForCategory(category: string): CastItem[] {
        return this.show.cast
            .filter(item => this.rolesProvider.getCategoryForRole(item.role) === category)
            .sort(this.rolesProvider.sortByRole.bind(this.rolesProvider));
    }

    getDateFromParams(): Moment {
        const { year, month, day, time } = this.navParams.data;
        return moment(`${day}.${month}.${year} ${time}`, 'DD.MM.YYYY HHmm', true);
    }

    getLetterAvatar(castItem: CastItem): string {
        return castItem.person.name.toUpperCase().charAt(0);
    }

}
