import { Component, NgZone, ViewChild } from '@angular/core';
import { Content, IonicPage, NavParams, ScrollEvent, ToastController } from 'ionic-angular';
import { ShowsProvider } from '../../providers/shows/shows';
import moment, { Moment } from 'moment';
import { CastItem, Show } from '../../models/models';
import { RolesProvider } from '../../providers/roles/roles';
import { animate, style, transition, trigger } from '@angular/animations';

@IonicPage({
    segment: 'shows/:location/:day/:month/:year/:time'
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
                public toastCtrl: ToastController,
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
        this.showsProvider.fetchShow(date, location).subscribe(
            show => {
                this.show = show;
                this.content.resize();
            },
            err => {
                console.error(err);
                this.toastCtrl.create({
                    message: 'Die Suche konnte nicht durchgeführt werden.',
                    position: 'middle',
                }).present();
            }
        );
    }

    onScroll(event: ScrollEvent): void {
        this.zone.run(() => {
            this.showScrollToTop = event.scrollTop > 250;
        });
    }

    onScrollToTop(event: any): void {
        event.preventDefault();
        this.content.scrollToTop(250);
    }

    getDateFromParams(): Moment {
        const { year, month, day, time } = this.navParams.data;
        return moment(`${day}.${month}.${year} ${time}`, 'DD.MM.YYYY HHmm');
    }

}
