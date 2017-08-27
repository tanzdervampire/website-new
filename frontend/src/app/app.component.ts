import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ShowListPage } from '../pages/show-list/show-list';
import { ActorListPage } from '../pages/actor-list/actor-list';
import { ShowSubmitStartPage } from '../pages/show-submit-start/show-submit-start';

interface PageInterface {
    title: string;
    icon?: string;
    component: Component;
    name: string;
}

interface MainPageInterface extends PageInterface {
    subPages?: PageInterface[];
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = ShowListPage;

    pages: MainPageInterface[];
    activePage: MainPageInterface;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen) {

        this.initializeApp();

        const showSubPages = [
            { title: 'Vorstellung eintragen', icon: 'add', component: ShowSubmitStartPage, name: 'ShowSubmitStartPage' },
        ];

        this.pages = [
            { title: 'Vorstellungen', icon: 'film', component: ShowListPage, name: 'ShowListPage', subPages: showSubPages },
            { title: 'Darsteller', icon: 'people', component: ActorListPage, name: 'ActorListPage' },
        ];

        this.activePage = this.pages[0];
    }

    initializeApp(): void {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(event: any, page: MainPageInterface): void {
        event.preventDefault();
        this.activePage = page;
        this.nav.setRoot(page.component);
    }

    openSubPage(event: any, page: PageInterface): void {
        event.preventDefault();
        this.nav.push(page.component);
    }

    isActive(page: MainPageInterface): string {
        return this.activePage === page ? 'primary' : null;
    }

}
