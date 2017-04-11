import { Component, Input } from '@angular/core';
import { MapManagementService } from './../../services/map-management/map-management.service';


@Component({
  selector: 'map-information-field',
  templateUrl: './information-field.component.html',
  styleUrls: ['./information-field.component.scss']
})
export class InformationFieldComponent {

  isOpen: boolean = false; 

  street: string;
  street_nr: string;
  postal_code: string;
  city: string;

  constructor() {
    MapManagementService.registerInformationField(this);
  }

  public changeInfo(chanchedMarker: any) {
    this.street = chanchedMarker.tags['addr:street'];
    this.street_nr = chanchedMarker.tags['addr:housenumber'];
    this.postal_code = chanchedMarker.tags['addr:postcode'];
    this.city = chanchedMarker.tags['addr:city'];
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }

}