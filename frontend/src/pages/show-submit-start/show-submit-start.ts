import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import moment, { Moment } from 'moment';
import { ShowSubmitCastPage } from '../show-submit-cast/show-submit-cast';
import { ProductionsProvider } from '../../providers/productions/productions';
import { Production } from '../../models/models';

@IonicPage({
    segment: 'shows/submit'
})
@Component({
    selector: 'page-show-submit-start',
    templateUrl: 'show-submit-start.html',
})
export class ShowSubmitStartPage {

    showDate: string;
    showTime: string;
    production: Production;

    today = moment().toISOString();
    productions: Production[];
    hadRequestError: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public productionsProvider: ProductionsProvider) {
    }

    onSwipeShowDate({ direction }): void {
        if (!this.showDate) {
            return;
        }

        const currentDate = moment(this.showDate);
        switch (direction) {
            case /* LEFT */ 2:
                this.showDate = currentDate.add(1, 'day').toISOString();
                this.onShowDateChange(this.showDate);
                break;
            case /* RIGHT */ 4:
                this.showDate = currentDate.subtract(1, 'day').toISOString();
                this.onShowDateChange(this.showDate);
                break;
        }
    }

    selectToday(): void {
        this.showDate = moment().toISOString();
        this.onShowDateChange(this.showDate);
    }

    onShowDateChange(date: string): void {
        this.production = undefined;
        this.productions = undefined;
        this.hadRequestError = false;

        this.productionsProvider.getProductionsFor(moment(date)).subscribe(productions => {
            this.productions = productions;

            switch (productions.length) {
                case 0:
                    this.showErrorToast('Zu diesem Zeitpunkt wurde das Musical nicht aufgeführt.')
                    break;
                case 1:
                    this.production = productions[0];
                    break;
                default:
                    break;
            }
        }, () => {
            this.productions = [];
            this.hadRequestError = true;
            this.showErrorToast('Es gab ein Problem mit der Verbindung');
        });
    }

    gotoCastSelection(): void {
        if (!this.showDate) {
            this.showErrorToast('Bitte gib das Datum der Vorstellung an.');
            return;
        }
        if (!this.showTime) {
            this.showErrorToast('Bitte gib die Uhrzeit der Vorstellung an.');
            return;
        }
        if (!this.productions || this.productions.length === 0) {
            this.showErrorToast('Zu diesem Zeitpunkt wurde das Musical nicht aufgeführt.');
            return;
        }
        if (!this.production) {
            this.showErrorToast('Bitte gib den Ort der Vorstellung an.');
            return;
        }

        const [year, month, day, time] = this.convertShowDate()
            .format('YYYY MM DD HHmm').split(' ');

        this.navCtrl.push(ShowSubmitCastPage, {
            location: this.production.location,
            year, month, day, time
        });
    }

    convertShowDate(): Moment {
        const date = moment(this.showDate).format('DD.MM.YYYY');
        return moment(`${date} ${this.showTime}`, 'DD.MM.YYYY HH:mm');
    }

    showErrorToast(message: string): void {
        const toast = this.toastCtrl.create({
            message,
            duration: 5000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
            dismissOnPageChange: true,
        });

        toast.present();
    }

}
