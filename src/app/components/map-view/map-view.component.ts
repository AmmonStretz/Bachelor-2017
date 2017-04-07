import { Component, OnInit } from '@angular/core';
import { MapManagementService } from './../../services/map-management/map-management.service';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  constructor() {navigator.geolocation.watchPosition((position) => {
      MapManagementService.updatePosition(position);
    }, (error) => {
      //
    });
  }
  onclickLocationButton(): void {
    MapManagementService.panToLocation();
  }

  onclickRotationButton(): void {
    MapManagementService.panToRotation();
  }

  onclickStartRouteButton(): void {
    MapManagementService.setRoute();
  }

  ngOnInit() {
  }

}