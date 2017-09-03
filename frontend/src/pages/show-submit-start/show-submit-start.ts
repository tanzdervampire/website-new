import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import moment, { Moment } from 'moment';
import { ShowSubmitCastPage } from '../show-submit-cast/show-submit-cast';
import { ProductionsProvider } from '../../providers/productions/productions';
import { CastItem, Production } from '../../models/models';
import { ShowsProvider } from '../../providers/shows/shows';
import { ShowSubmitImportPage } from '../show-submit-import/show-submit-import';

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
    cast: CastItem[];

    today = moment.utc().toISOString();
    productions: Production[];
    hadRequestError: boolean = false;

    constructor(private navCtrl: NavController,
                private modalCtrl: ModalController,
                private alertCtrl: AlertController,
                private navParams: NavParams,
                private toastCtrl: ToastController,
                private showsProvider: ShowsProvider,
                private productionsProvider: ProductionsProvider) {

        const { year, month, day } = this.navParams.data;
        if (year && month && day) {
            this.showDate = moment.utc(`${day}.${month}.${year}`, 'DD.MM.YYYY').toISOString();
            this.onShowDateChange(null, this.showDate);
        }
    }

    onSwipeShowDate({ direction }): void {
        if (!this.showDate) {
            return;
        }

        const currentDate = moment.utc(this.showDate);
        switch (direction) {
            case /* LEFT */
            2:
                this.showDate = currentDate.add(1, 'day').toISOString();
                this.onShowDateChange(null, this.showDate);
                break;
            case /* RIGHT */
            4:
                this.showDate = currentDate.subtract(1, 'day').toISOString();
                this.onShowDateChange(null, this.showDate);
                break;
        }
    }

    selectToday(event: any): void {
        event.preventDefault();
        this.showDate = moment.utc().toISOString();
        this.onShowDateChange(null, this.showDate);
    }

    onShowDateChange(event: any, date: string): void {
        if (event && event.preventDefault) {
            event.preventDefault();
        }

        this.production = undefined;
        this.productions = undefined;
        this.hadRequestError = false;

        this.productionsProvider.getProductionsFor(moment.utc(date)).subscribe(productions => {
            this.productions = productions;

            switch (productions.length) {
                case 0:
                    this.showErrorToast('Zu diesem Zeitpunkt wurde das Musical nicht aufgeführt.');
                    break;
                case 1:
                    this.production = productions[ 0 ];
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

    onImportPicture(event: any): void {
        event.preventDefault();
        const modal = this.modalCtrl.create(ShowSubmitImportPage);
        modal.onDidDismiss((cast: CastItem[]) => {
            this.cast = cast;
        });

        modal.present();
    }

    validateInput(): string {
        if (!this.showDate) {
            return 'Bitte gib das Datum der Vorstellung an.';
        }
        if (!this.showTime) {
            return 'Bitte gib die Uhrzeit der Vorstellung an.';
        }
        if (!this.productions || this.productions.length === 0) {
            return 'Zu diesem Zeitpunkt wurde das Musical nicht aufgeführt.';
        }
        if (!this.production) {
            return 'Bitte gib den Ort der Vorstellung an.';
        }

        return null;
    }

    gotoCastSelection(event: any): void {
        event.preventDefault();

        const errorMessage = this.validateInput();
        if (errorMessage) {
            this.showErrorToast(errorMessage);
            return;
        }

        const [ year, month, day, time ] = this.convertShowDate()
            .format('YYYY MM DD HHmm').split(' ');

        const location = this.production.location;
        const cast = this.cast;
        this.showsProvider.fetchShow(this.convertShowDate(), location).subscribe(
            show => {
                if (!show) {
                    this.navCtrl.push(ShowSubmitCastPage, { location, year, month, day, time, cast });
                    return;
                }

                this.confirmUpdateExistingShow(
                    () => {
                        this.navCtrl.push(ShowSubmitCastPage, { location, year, month, day, time, cast: show.cast });
                    },
                    () => {
                        this.navCtrl.popToRoot();
                    }
                );
            },
            err => {
                this.showErrorToast('Ein Fehler ist aufgetreten.');
            }
        );
    }

    confirmUpdateExistingShow(onAccept: () => void, onCancel: () => void): void {
        this.alertCtrl
            .create({
                title: 'Vorstellung bereits eingetragen',
                message: 'Diese Vorstellung wurde bereits eingetragen. Möchtest du den bestehenden Eintrag korrigieren?',
                buttons: [
                    { text: 'Nein', role: 'cancel', handler: onCancel },
                    { text: 'Ja', handler: onAccept }
                ]
            }).present();
    }

    convertShowDate(): Moment {
        const date = moment.utc(this.showDate).format('DD.MM.YYYY');
        return moment.utc(`${date} ${this.showTime}`, 'DD.MM.YYYY HH:mm');
    }

    showErrorToast(message: string): void {
        const toast = this.toastCtrl.create({
            message,
            duration: 5000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'OK',
            dismissOnPageChange: false,
        });

        toast.present();
    }

}
