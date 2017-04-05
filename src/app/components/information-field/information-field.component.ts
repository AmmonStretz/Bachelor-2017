import { Component } from '@angular/core';
import { MapManagementService } from './../../services/map-management/map-management.service';


@Component({
  selector: 'map-information-field',
  templateUrl: './information-field.component.html',
  styleUrls: ['./information-field.component.scss']
})
export class InformationFieldComponent {

  street: string;
  street_nr: string;
  postal_code: string;
  city: string;

  constructor() {
    MapManagementService.setInfos(this);
  }

  public bla(chanchedMarker: any) {
    console.log("Marker");
    console.log(chanchedMarker.tags);
    this.street = chanchedMarker.tags['addr:street'];
    this.street_nr = chanchedMarker.tags['addr:housenumber'];
    this.postal_code = chanchedMarker.tags['addr:postcode'];
    this.city = chanchedMarker.tags['addr:city'];
  }

}