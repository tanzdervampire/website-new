import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class RolesProvider {

    roles: string[] = [
        'Graf von Krolock',
        'Sarah',
        'Alfred',
        'Professor Abronsius',
        'Chagal',
        'Magda',
        'Herbert',
        'Rebecca',
        'Koukol',
        'Dirigent',
        'Tanzsolisten',
        'Gesangssolisten',
        'Tanzensemble',
        'Gesangsensemble'
    ];

}
