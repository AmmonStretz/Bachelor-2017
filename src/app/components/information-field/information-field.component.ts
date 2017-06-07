import { Component } from '@angular/core';
import { MapDirective } from './../../directives/map/map.directive';
import { Node } from './../../classes/node';

@Component({
  selector: 'map-information-field',
  templateUrl: './information-field.component.html',
  styleUrls: ['./information-field.component.scss']
})
export class InformationFieldComponent {

  isOpen = false;
  activeMarker: Node;

  constructor() {
    MapDirective.infos = this;
  }

  public changeInfo(activeMarker: Node): void {
    this.activeMarker = activeMarker;
  }

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }

}