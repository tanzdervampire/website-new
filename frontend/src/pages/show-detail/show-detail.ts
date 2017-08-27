import { Component, NgZone, ViewChild } from '@angular/core';
import { Content, IonicPage, NavParams, ScrollEvent } from 'ionic-angular';
import { ShowsProvider } from '../../providers/shows/shows';
import moment, { Moment } from 'moment';
import { CastItem, Show } from '../../models/models';
import { RolesProvider } from '../../providers/roles/roles';
import { animate, style, transition, trigger } from '@angular/animations';

@IonicPage({
    segment: 'shows/:location/:year/:month/:day/:time'
})
@Component({
    selector: 'page-show-detail',
    templateUrl: 'show-detail.html',
    animations: [
        trigger('fab', [
            transition(':enter', [
                style({ transform: 'scale(0)' }),
                animate('.225s', style({ transform: 'scale(1)' })),
            ]),
            transition(':leave', [
                style({ transform: 'scale(1)' }),
                animate('.195s', style({ transform: 'scale(0)' })),
            ]),
        ]),
    ],
})
export class ShowDetailPage {

    show: Show;
    @ViewChild(Content) content: Content;
    showScrollToTop: boolean = false;

    constructor(private navParams: NavParams,
                public zone: NgZone,
                private showsProvider: ShowsProvider,
                public rolesProvider: RolesProvider) {
    }

    ionViewWillEnter(): void {
        /* If we get the already loaded show passed in, use it instead. */
        if (this.navParams.data.show) {
            this.show = this.navParams.data.show;
            this.content.resize();
            return;
        }

        const { location } = this.navParams.data;
        const date = this.getDateFromParams();
        // TODO error handler
        this.showsProvider.fetchShow(date, location).subscribe(show => {
            this.show = show;
            this.content.resize();
        });
    }

    onScroll(event: ScrollEvent): void {
        this.zone.run(() => {
            this.showScrollToTop = event.scrollTop > 250;
        });
    }

    onScrollToTop(): void {
        this.content.scrollToTop(250);
    }

    getCastItemsForCategory(category: string): CastItem[] {
        return this.show.cast
            .filter(item => this.rolesProvider.getCategoryForRole(item.role) === category)
            .sort(this.rolesProvider.sortCastItemByRole.bind(this.rolesProvider));
    }

    getDateFromParams(): Moment {
        const { year, month, day, time } = this.navParams.data;
        return moment(`${day}.${month}.${year} ${time}`, 'DD.MM.YYYY HHmm', true);
    }

    getLetterAvatar(castItem: CastItem): string {
        return castItem.person.name.toUpperCase().charAt(0);
    }

}
