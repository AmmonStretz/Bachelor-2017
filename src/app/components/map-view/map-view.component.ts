import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { InformationFieldComponent } from './../information-field/information-field.component';
import { MapManagementService } from './../../services/map-management/map-management.service';
import { MapDirective } from './../../directives/map/map.directive';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild('info') info: InformationFieldComponent;
  @ViewChild(MapDirective) map: MapDirective;
  settingsVisible = false;

  ngAfterViewInit() {
  }
  locate(): void {
    this.map.locate();
  }

  rotate(): void {
    this.map.rotate();
  }

  route(): void {
    this.map.route();
  }

}