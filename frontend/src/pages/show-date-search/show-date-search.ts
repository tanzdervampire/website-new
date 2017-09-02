import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Show } from '../../models/models';
import { ShowsProvider } from '../../providers/shows/shows';
import moment, { Moment } from 'moment';
import { ShowDetailPage } from '../show-detail/show-detail';
import { ShowSubmitStartPage } from '../show-submit-start/show-submit-start';

@IonicPage({
    segment: 'shows/:day/:month/:year'
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
        /* If we get the already loaded shows passed in, use those instead. */
        if (this.navParams.data.shows) {
            this.shows = this.navParams.data.shows;
            return;
        }

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
        return moment.utc(`${day}.${month}.${year}`, 'DD.MM.YYYY');
    }

    gotoShowSubmit(event: Event): void {
        event.preventDefault();

        const { year, month, day } = this.navParams.data;
        this.navCtrl.push(ShowSubmitStartPage, { year, month, day });
    }

    gotoShowDetail(event: Event, show: Show): void {
        event.preventDefault();
        const [year, month, day, time] = show.date.format('YYYY MM DD HHmm').split(' ');

        this.navCtrl.push(ShowDetailPage, {
            location: show.production.location,
            year, month, day, time
        });
    }

}
