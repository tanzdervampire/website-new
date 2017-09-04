import { Component } from '@angular/core';
import {
    AlertController, IonicPage, LoadingController, NavController, NavParams,
    ToastController
} from 'ionic-angular';
import { Show } from '../../models/models';
import { ShowsProvider } from '../../providers/shows/shows';
import { animate, style, transition, trigger } from '@angular/animations';

const toastOpts = {
    duration: 3000,
    position: 'bottom',
    showCloseButton: true,
    closeButtonText: 'OK',
    dismissOnPageChange: false,
};

@IonicPage()
@Component({
    selector: 'page-show-submit-review',
    templateUrl: 'show-submit-review.html',
    animations: [
        trigger('disclaimer', [
            transition(':leave', [
                animate('.195s', style({ transform: 'scaleY(0)', transformOrigin: 'top' })),
            ]),
        ]),
    ],
})
export class ShowSubmitReviewPage {

    show: Show;
    showDisclaimer: boolean = true;

    constructor(private navCtrl: NavController,
                private navParams: NavParams,
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private showsProvider: ShowsProvider) {
        this.show = this.navParams.data.show;
    }

    submitShow(event?: any): void {
        if (event) {
            event.preventDefault();
        }

        const loader = this.loadingCtrl.create({ content: 'Bitte warten…' });
        loader.present();

        const show = this.show;
        this.showsProvider.postShow(show).subscribe(
            response => {
                loader.dismiss();
                this.toastCtrl.create({ ...toastOpts, message: 'Vorstellung erfolgreich eingetragen!' }).present();
                this.navCtrl.popToRoot();
            },
            err => {
                console.error(err);
                loader.dismiss();

                if (err.status && err.status === 503) {
                    this.showMaintenanceModeError();
                    return;
                }

                this.showRetryErrorDialog();
            }
        );
    }

    showMaintenanceModeError(): void {
        this.alertCtrl.create({
            title: 'Keine Sorge!',
            message: 'Vielen Dank für deinen Eintrag! Im Moment kontrollieren wir jeden neuen Eintrag bevor er sichtbar wird und bitten daher um etwas Geduld.',
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel',
                    handler: () => {
                        this.navCtrl.popToRoot();
                    },
                },
            ],
        }).present();
    }

    showRetryErrorDialog(): void {
        this.alertCtrl.create({
            title: 'Ups!',
            message: 'Beim Speichern der Vorstellung ist ein Fehler aufgetreten.',
            buttons: [
                {
                    text: 'Nochmal versuchen',
                    handler: () => this.submitShow(),
                },
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                },
            ],
        }).present();
    }

    onConfirmDisclaimer(event: any): void {
        event.preventDefault();
        this.showDisclaimer = false;
    }

}
