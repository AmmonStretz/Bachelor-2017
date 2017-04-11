import { Directive, ElementRef } from '@angular/core';
import { Map, View, Tile, layer, source, control, interaction, geom, proj, format, style, Feature, coordinate } from 'openlayers';
import { MapManagementService } from './../../services/map-management/map-management.service';
import { OsmConnectionService } from './../../services/osm-connection/osm-connection.service';
import { RoutingService } from './../../services/routing/routing.service';

@Directive({
  selector: '[map]'
})
export class MapDirective {

  map: Map;
  mMS: MapManagementService;

  constructor(elementRef: ElementRef, private osmConnection: OsmConnectionService) {
    let mMS = new MapManagementService(elementRef);
    this.mMS =mMS;
    this.mMS.osmConnection = osmConnection;
    this.mMS.routingService = new RoutingService(osmConnection);
    this.map = this.mMS.map;
    this.map.on('click', function (event) {
      mMS.click(event);
    });

    //Position Listener added
    navigator.geolocation.watchPosition((position) => {
      this.mMS.updatePosition(position);
    }, (error) => { });
  }
  public bla(){
    console.log("blabla");
  }

  public locate(): void {
    this.mMS.panToLocation();
  }

  public rotate(): void {
    this.mMS.panToRotation();
  }

  public route(): void {
    this.mMS.setRoute();
  }

  public clickMarker() {
    console.log("click Marker");
  }

}