import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { InformationFieldComponent } from './../information-field/information-field.component';
import { NavigationComponent } from './../navigation/navigation.component';
import { MapManagementService } from './../../services/map-management/map-management.service';
import { MapDirective } from './../../directives/map/map.directive';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {

  @ViewChild('info') info: InformationFieldComponent;
  @ViewChild('navi') navi: NavigationComponent;
  @ViewChild(MapDirective) map: MapDirective;
}
