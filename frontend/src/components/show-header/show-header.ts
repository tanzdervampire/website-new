import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Show } from '../../models/models';

@Component({
    selector: 'show-header',
    templateUrl: 'show-header.html'
})
export class ShowHeaderComponent implements OnChanges {

    @Input() show: Show;

    avatarText: string;
    formattedDate: string;
    formattedTime: string;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.show) {
            if (!changes.show.currentValue) {
                this.avatarText = undefined;
                this.formattedDate = undefined;
                this.formattedTime = undefined;
            } else {
                this.avatarText = changes.show.currentValue.date.locale('de').format('dddd').substr(0, 2);
                this.formattedDate = changes.show.currentValue.date.format('DD. MMMM YYYY');
                this.formattedTime = changes.show.currentValue.date.format('HH:mm');
            }
        }
    }

}
