import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { ShowListPage } from '../pages/show-list/show-list';
import { ActorListPage } from '../pages/actor-list/actor-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ActorsProvider } from '../providers/actors/actors';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoFocusDirective } from '../directives/auto-focus/auto-focus';
import { ActorListFilter } from '../pages/actor-list/actor-list-filter';
import { RolesProvider } from '../providers/roles/roles';
import { ShowsProvider } from '../providers/shows/shows';
import { SpinnerComponent } from '../components/spinner/spinner';
import { ShowDetailPage } from '../pages/show-detail/show-detail';
import moment from 'moment';
import { ShowItemComponent } from '../components/show-item/show-item';
import { ShowDateSearchPage } from '../pages/show-date-search/show-date-search';
import { ShowSubmitStartPage } from '../pages/show-submit-start/show-submit-start';
import { ShowSubmitCastPage } from '../pages/show-submit-cast/show-submit-cast';
import { ProductionsProvider } from '../providers/productions/productions';
import { IonTextAvatar } from '../directives/ion-text-avatar/ion-text-avatar';
import { CastListComponent } from '../components/cast-list/cast-list';
import { ShowSubmitReviewPage } from '../pages/show-submit-review/show-submit-review';
import { ShowHeaderComponent } from '../components/show-header/show-header';
import { ShowSubmitImportPage } from '../pages/show-submit-import/show-submit-import';

@NgModule({
    declarations: [
        MyApp,
        ShowListPage,
        ShowDetailPage,
        ShowDateSearchPage,
        ShowSubmitStartPage,
        ShowSubmitCastPage,
        ShowSubmitReviewPage,
        ShowSubmitImportPage,
        ActorListPage,
        ActorListFilter,
        AutoFocusDirective,
        IonTextAvatar,
        SpinnerComponent,
        ShowItemComponent,
        CastListComponent,
        ShowHeaderComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        IonicModule.forRoot(MyApp, {
            /* We force material design on all platforms to avoid some issues. */
            mode: 'md',
            /* If the browser respects it, try to prevent it from allowing swipe-to-go-back. */
            swipeBackEnabled: false,
            /* Removes the hashtag in deep links. */
            /* !!! Will be changed during deployment */
            locationStrategy: null,
            monthNames: moment.localeData('de').months(),
            monthShortNames: moment.localeData('de').monthsShort(),
            dayNames: moment.localeData('de').weekdays(),
            dayShortNames: moment.localeData('de').weekdaysShort(),
        }, {
            links: [
                { component: ShowListPage, name: 'ShowListPage', segment: 'shows' },
                {
                    component: ShowDateSearchPage,
                    name: 'ShowDateSearchPage',
                    segment: 'shows/:day/:month/:year',
                    defaultHistory: [ ShowListPage ]
                },
                {
                    component: ShowSubmitStartPage,
                    name: 'ShowSubmitStartPage',
                    segment: 'shows/submit',
                    defaultHistory: [ ShowListPage ]
                },
                {
                    component: ShowSubmitCastPage,
                    name: 'ShowSubmitCastPage',
                    segment: 'shows/:location/:day/:month/:year/:time/submit',
                    defaultHistory: [ ShowListPage ]
                },
                {
                    component: ShowDetailPage,
                    name: 'ShowDetailPage',
                    segment: 'shows/:location/:day/:month/:year/:time',
                    defaultHistory: [ ShowListPage ]
                },
                { component: ActorListPage, name: 'ActorListPage', segment: 'actors' },
            ],
        }),
    ],
    bootstrap: [ IonicApp ],
    entryComponents: [
        MyApp,
        ShowListPage,
        ShowDetailPage,
        ShowDateSearchPage,
        ShowSubmitStartPage,
        ShowSubmitCastPage,
        ShowSubmitReviewPage,
        ShowSubmitImportPage,
        ActorListPage,
        ActorListFilter,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ActorsProvider,
        RolesProvider,
        ShowsProvider,
        ProductionsProvider,
    ],
})
export class AppModule {
}
