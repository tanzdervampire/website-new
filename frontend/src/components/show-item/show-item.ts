import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Show } from '../../models/models';
import { RolesProvider } from '../../providers/roles/roles';
import 'moment/locale/de';

@Component({
    selector: 'show-item',
    templateUrl: 'show-item.html'
})
export class ShowItemComponent {

    @Input() show: Show;

    constructor(private rolesProvider: RolesProvider) {}

    formatAvatar(): string {
        return this.show.date
            .locale('de')
            .format('dddd')
            .substr(0, 2);
    }

    formatTime(): string {
        return this.show.date.format('HH:mm');
    }

    formatLocation(): string {
        const { location, theater } = this.show.production;
        return `${theater}, ${location}`;
    }

    formatCast(): string {
        return this.show.cast
            .filter(entry => this.rolesProvider.isPrimary(entry.role))
            .sort(this.rolesProvider.sortByRole.bind(this.rolesProvider))
            .map(entry => entry.person)
            .map(person => person.name)
            .join(', ');
    }

}
