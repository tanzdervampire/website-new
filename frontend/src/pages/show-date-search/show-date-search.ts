import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Show } from '../../models/models';
import { ShowsProvider } from '../../providers/shows/shows';
import moment, { Moment } from 'moment';
import { ShowDetailPage } from '../show-detail/show-detail';

@IonicPage({
    segment: 'shows/:year/:month/:day'
})
@Component({
    selector: 'page-show-date-search',
    templateUrl: 'show-date-search.html',
})
export class ShowDateSearchPage {

    shows: Show[];

    constructor(private navParams: NavParams,
                private navCtrl: NavController,
                private showsProvider: ShowsProvider) {
    }

    ionViewDidLoad() {
        const date = this.getDateFromParams();

        this.showsProvider.fetchShowsForDay(date).subscribe(shows => {
            this.shows = shows;
        });
    }

    formatDate(): string {
        return this.getDateFromParams().format('DD.MM.YYYY');
    }

    getDateFromParams(): Moment {
        const { year, month, day } = this.navParams.data;
        return moment(`${day}.${month}.${year}`, 'DD.MM.YYYY');
    }

    gotoShowDetail(show: Show): void {
        const [year, month, day, time] = show.date.format('YYYY MM DD HHmm').split(' ');

        this.navCtrl.push(ShowDetailPage, {
            location: show.production.location,
            year, month, day, time
        });
    }

}
