import { Component, OnInit, ViewChild } from '@angular/core';
import { ShowsProvider } from '../../providers/shows/shows';
import { Moment } from 'moment';
import 'moment/locale/de';
import { RolesProvider } from '../../providers/roles/roles';
import { Show } from '../../models/models';
import { DateTime, InfiniteScroll, NavController } from 'ionic-angular';
import { ShowDetailPage } from '../show-detail/show-detail';
import { ShowDateSearchPage } from '../show-date-search/show-date-search';
import moment from 'moment';

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
})
export class ShowListPage implements OnInit {

    @ViewChild('datePicker') datePicker: DateTime;
    shows: MonthSection[] = [];

    selectedDate: string = moment().toISOString();
    maxDate: string = moment().format('YYYY-MM-DD');

    constructor(
        private navCtrl: NavController,
        private showsProvider: ShowsProvider) {
    }

    ngOnInit(): void {
        this.showsProvider.fetchLatestMonth()
            .subscribe(this.pushShowsForMonth.bind(this));
    }

    onDatePickerChange(event: any): void {
        const date = moment(`${event.day}.${event.month}.${event.year}`, 'DD.MM.YYYY');
        const [day, month, year] = date.format('DD MM YYYY').split(' ');

        this.navCtrl.push(ShowDateSearchPage, {
            year, month, day
        });
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

    gotoShowDetail(show: Show): void {
        const [year, month, day, time] = show.date.format('YYYY MM DD HHmm').split(' ');

        this.navCtrl.push(ShowDetailPage, {
            location: show.production.location,
            year, month, day, time
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
