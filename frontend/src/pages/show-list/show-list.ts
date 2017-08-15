import { Component, OnInit } from '@angular/core';
import { ShowsProvider } from '../../providers/shows/shows';
import moment, { Moment } from 'moment';
import 'moment/locale/de';
import { RolesProvider } from '../../providers/roles/roles';
import { Show } from '../../models/models';
import { InfiniteScroll } from 'ionic-angular';

interface ShowItem {
    date: Moment;
    formattedTime: string;
    location: string;
    theater: string;
    castPreview: string;
}

interface Section<T> {
    title: string;
    items: T[];
}

interface DaySection extends Section<ShowItem> {
    weekday: string;
}

interface MonthSection extends Section<DaySection> {
}

@Component({
    selector: 'page-show-list',
    templateUrl: 'show-list.html',
})
export class ShowListPage implements OnInit {

    shows: MonthSection[] = [];

    constructor(
        private showsProvider: ShowsProvider,
        private rolesProvider: RolesProvider) {
    }

    ngOnInit(): void {
        this.showsProvider.fetchLatestMonth()
            .subscribe(this.pushShowsForMonth.bind(this));
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

    pushShowsForMonth(shows: Show[]): void {
        if (!shows || shows.length === 0) {
            return;
        }

        const section: MonthSection = {
            title: this.formatMonth(shows[0].date),
            items: this.groupShowsByDay(shows),
        };

        this.shows.push(section);
        console.log(this.shows);
    }

    groupShowsByDay(shows: Show[]): DaySection[] {
        return shows
            .reduce((acc: Show[][], show: Show): Show[][] => {
                const day = +show.date.format('DD');
                (acc[day] = acc[day] || []).push(show);
                return acc;
            }, [])
            .filter((day: Show[]): boolean => !!day)
            .map((day: Show[]): ShowItem[] => {
                return day.map((show: Show): ShowItem => {
                    return this.convertShow(show);
                });
            })
            .map((day: ShowItem[]): DaySection => {
                return {
                    title: this.formatDay(day[0].date),
                    items: day,
                    weekday: this.formatWeekday(day[0].date),
                };
            })
            .reverse();
    }

    convertShow(show: Show): ShowItem {
        return {
            date: show.date,
            formattedTime: this.formatTime(show.date),
            location: show.production.location,
            theater: show.production.theater,
            castPreview: this.formatCast(show),
        };
    }

    formatWeekday(date: Moment): string {
        return date.locale('de').format('dddd');
    }

    formatTime(date: Moment): string {
        return date.format('HH:mm');
    }

    formatDay(date: Moment): string {
        return date.locale('de').format('DD. MMMM YYYY');
    }

    formatMonth(date: Moment): string {
        return date.locale('de').format('MMMM YYYY');
    }

    formatCast(show: Show): string {
        return show.cast
            .filter(entry => this.rolesProvider.isPrimary(entry.role))
            .sort(this.rolesProvider.sortByRole.bind(this.rolesProvider))
            .map(entry => entry.person)
            .map(person => person.name)
            .join(', ');
    }

}
