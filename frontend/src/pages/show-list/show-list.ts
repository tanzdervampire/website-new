import { Component, NgZone, ViewChild } from '@angular/core';
import { ShowsProvider } from '../../providers/shows/shows';
import moment, { Moment } from 'moment';
import 'moment/locale/de';
import { Show } from '../../models/models';
import {
    Content, DateTime, InfiniteScroll, LoadingController, NavController, ScrollEvent,
    ToastController
} from 'ionic-angular';
import { ShowDetailPage } from '../show-detail/show-detail';
import { ShowDateSearchPage } from '../show-date-search/show-date-search';
import { animate, style, transition, trigger } from '@angular/animations';
import { ShowSubmitStartPage } from '../show-submit-start/show-submit-start';

interface Section<T> {
    title: string;
    items: T[];
}

interface DaySection extends Section<Show> {
    weekday: string;
}

interface MonthSection extends Section<DaySection> {
}

@Component({
    selector: 'page-show-list',
    templateUrl: 'show-list.html',
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
export class ShowListPage {

    @ViewChild('datePicker') datePicker: DateTime;
    @ViewChild(Content) content: Content;
    shows: MonthSection[] = [];
    selectedDate: string = moment.utc().toISOString();
    maxDate: string = moment.utc().format('YYYY-MM-DD');
    showScrollToTop: boolean = false;

    constructor(
        private navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        private showsProvider: ShowsProvider,
        public zone: NgZone) {
    }

    ionViewWillEnter(): void {
        this.showsProvider.fetchLatestMonth()
            .subscribe(this.pushShowsForMonth.bind(this));
    }

    ionViewWillLeave(): void {
        this.shows = [];
    }

    onScroll(event: ScrollEvent): void {
        this.zone.run(() => {
            this.showScrollToTop = event.scrollTop > 500;
        });
    }

    onDatePickerChange(event: any): void {
        const date = moment.utc(`${event.day}.${event.month}.${event.year}`, 'DD.MM.YYYY');
        const [year, month, day] = date.format('YYYY MM DD HHmm').split(' ');

        const loading = this.loadingCtrl.create({ content: 'Vorstellungen werden gesucht…' });
        loading.present();

        this.showsProvider.fetchShowsForDay(date).subscribe(
            shows => {
                loading.dismiss();

                /* If there's only one show on that day, jump to it directly. */
                if (shows.length === 1) {
                    const [ show ] = shows;
                    this.gotoShowDetail(null, show);
                } else {
                    this.navCtrl.push(ShowDateSearchPage, { year, month, day, shows });
                }
            },
            err => {
                console.error(err);
                loading.dismiss();
                this.toastCtrl.create({
                    message: 'Die Suche konnte nicht durchgeführt werden.',
                    position: 'middle',
                }).present();
            }
        );
    }

    onScrollToTop(event: any): void {
        event.preventDefault();
        this.content.scrollToTop(250);
    }

    onInfiniteScroll(infiniteScroll: InfiniteScroll): void {
        if (!this.shows || this.shows.length === 0) {
            return;
        }

        const before = this.shows.slice(-1)[0].items.slice(-1)[0].items[0].date;
        this.showsProvider.fetchLatestMonth(before)
            .subscribe(response => {
                this.pushShowsForMonth(response);
                infiniteScroll.complete();
            });
    }

    gotoShowSubmit(event: any): void {
        event.preventDefault();
        this.navCtrl.push(ShowSubmitStartPage);
    }

    gotoShowDetail(event: any, show: Show): void {
        if (event) {
            event.preventDefault();
        }

        const [year, month, day, time] = show.date.format('YYYY MM DD HHmm').split(' ');

        this.navCtrl.push(ShowDetailPage, {
            location: show.production.location,
            year, month, day, time, show
        });
    }

    pushShowsForMonth(shows: Show[]): void {
        if (!shows || shows.length === 0) {
            return;
        }

        const section: MonthSection = {
            title: this.formatMonth(shows[0].date),
            items: this.groupShowsByDay(shows),
        };

        this.shows.push(section);
    }

    groupShowsByDay(shows: Show[]): DaySection[] {
        return shows
            .reduce((acc: Show[][], show: Show): Show[][] => {
                const day = +show.date.format('DD');
                (acc[day] = acc[day] || []).push(show);
                return acc;
            }, [])
            .filter((day: Show[]): boolean => !!day)
            .map((day: Show[]): DaySection => {
                return {
                    title: this.formatDay(day[0].date),
                    items: day,
                    weekday: this.formatWeekday(day[0].date),
                };
            })
            .reverse();
    }

    formatWeekday(date: Moment): string {
        return date.locale('de').format('dddd');
    }

    formatDay(date: Moment): string {
        return date.locale('de').format('DD. MMMM YYYY');
    }

    formatMonth(date: Moment): string {
        return date.locale('de').format('MMMM YYYY');
    }

}
