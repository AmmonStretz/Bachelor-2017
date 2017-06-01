import { Component } from '@angular/core';
import { MapDirective } from './../../directives/map/map.directive';

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
    MapDirective.infos = this;
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