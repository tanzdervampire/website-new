import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RolesProvider } from '../../providers/roles/roles';

@IonicPage({
    segment: 'shows/:location/:year/:month/:day/:time/submit'
})
@Component({
  selector: 'page-show-submit-cast',
  templateUrl: 'show-submit-cast.html',
})
export class ShowSubmitCastPage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public rolesProvider: RolesProvider) {
  }

}
