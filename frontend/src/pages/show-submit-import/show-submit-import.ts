import { Component } from '@angular/core';
import { IonicPage, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { ShowsProvider } from '../../providers/shows/shows';
import { CastItem, OcrCastItem } from '../../models/models';
import { ActorsProvider } from '../../providers/actors/actors';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
    selector: 'page-show-submit-import',
    templateUrl: 'show-submit-import.html',
})
export class ShowSubmitImportPage {

    constructor(
        private viewCtrl: ViewController,
        private loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        private actorsProvider: ActorsProvider,
        private showsProvider: ShowsProvider,
    ) {
    }

    onFileSelected(event: Event): void {
        event.preventDefault();
        const files: FileList = (<any>event.target).files;

        const file = files.item(0);

        const loading = this.loadingCtrl.create({ content: 'Das Bild wird analysiert…' });
        loading.present();

        this.showsProvider.analyzeImage(file)
            .mergeMap(response => this.convertOcrResponse(response))
            .subscribe(
            castItems => {
                loading.dismiss();
                this.toastCtrl.create({
                    message: `Es wurden ${castItems.length} Darsteller erkannt.`,
                    dismissOnPageChange: false,
                    showCloseButton: true,
                    closeButtonText: 'OK',
                }).present();
                this.viewCtrl.dismiss(castItems);
            },
            err => {
                console.error(err);

                loading.dismiss();
                this.toastCtrl.create({ message: 'Das Bild konnte nicht analysiert werden.' }).present();
            }
        );
    }

    convertOcrResponse(response: OcrCastItem[]): Observable<CastItem[]> {
        return this.actorsProvider.getListOfActors().map(actors => {
            return response.map(ocrItem => {
                return {
                    role: ocrItem.role,
                    person: actors.find(actor => actor.name === ocrItem.name),
                };
            });
        });
    }

}
