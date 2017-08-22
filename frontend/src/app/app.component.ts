import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ShowListPage } from '../pages/show-list/show-list';
import { ActorListPage } from '../pages/actor-list/actor-list';

interface PageInterface {
    title: string;
    name: string;
    icon?: string;
    component: Component;
}

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = ShowListPage;

    pages: PageInterface[];
    activePage: PageInterface;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();

        this.pages = [
            { title: 'Vorstellungen', icon: 'film', component: ShowListPage, name: 'ShowListPage' },
            { title: 'Darsteller', icon: 'people', component: ActorListPage, name: 'ActorListPage' },
        ];

        this.activePage = this.pages[0];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page: PageInterface) {
        this.activePage = page;
        this.nav.setRoot(page.component);
    }

    isActive(page: PageInterface): string {
        return this.activePage === page ? 'primary' : null;
    }

}
