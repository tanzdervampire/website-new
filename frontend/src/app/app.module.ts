import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
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
import { IonTextAvatar } from 'ionic-text-avatar';
import { ShowsProvider } from '../providers/shows/shows';
import { SpinnerComponent } from '../components/spinner/spinner';
import { ShowDetailPage } from '../pages/show-detail/show-detail';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ShowListPage,
        ShowDetailPage,
        ActorListPage,
        ActorListFilter,
        AutoFocusDirective,
        IonTextAvatar,
        SpinnerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        IonicModule.forRoot(MyApp, {}, {
            links: [
                { component: HomePage, name: 'HomePage', segment: 'home' },
                { component: ShowListPage, name: 'ShowListPage', segment: 'shows' },
                { component: ShowDetailPage, name: 'ShowDetailPage', segment: 'shows/:location/:year/:month/:day/:time', defaultHistory: [ShowListPage] },
                { component: ActorListPage, name: 'ActorListPage', segment: 'actors' },
            ],
        }),
    ],
    bootstrap: [ IonicApp ],
    entryComponents: [
        MyApp,
        HomePage,
        ShowListPage,
        ShowDetailPage,
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
    ],
})
export class AppModule {
}
