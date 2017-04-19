import { Directive, ElementRef } from '@angular/core';
import {
  Map, View, Tile, layer, source, control,
  Coordinate, interaction, geom, proj, format, style, Feature, coordinate
} from 'openlayers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { MapManagementService } from './../../services/map-management/map-management.service';
import { OsmConnectionService } from './../../services/osm-connection/osm-connection.service';
import { RoutingService } from './../../services/routing/routing.service';

import { Route } from './../../classes/route';
import { Node } from './../../classes/node';

@Directive({
  selector: '[map]'
})
export class MapDirective {

  map: Map;
  mapManagementService: MapManagementService;
  routingService: RoutingService;
  public position: any;
  public activeMarker: Node = null;

  constructor(elementRef: ElementRef, private osmConnection: OsmConnectionService) {
    const mapManagementService = new MapManagementService(elementRef);
    this.mapManagementService = mapManagementService;
    this.routingService = new RoutingService(osmConnection);
    this.mapManagementService.osmConnection = osmConnection;
    this.mapManagementService.routingService = new RoutingService(osmConnection);
    this.map = this.mapManagementService.map;

    let d: MapDirective = this;
    // onClick Listener added
    this.map.on('click', function (event) {
      d.click(event);
    });

    // Position Listener added
    navigator.geolocation.watchPosition((position) => {
      this.position = position;
      console.log(this.position);
      // this.mapManagementService.updatePosition(position);
    }, (error) => { });
  }

  public locate(): void {
    if (this.position != null) {
      // console.log(this.position.coords);
      this.mapManagementService.goToLocation(this.position.coords)
    }
  }

  public rotate(): void {
    let goalRotation = 0;
    if (this.position.coords.heading != null) {
      goalRotation = this.position.coords.heading;
    }
    this.mapManagementService.rotate(goalRotation);
  }

  public route(): void {

    console.log('route()');
    if (this.activeMarker) {
      this.routingService.generateRoute(
        new Node(null, this.position.coords.longitude, this.position.coords.latitude),
        this.activeMarker
      ).map((res) => { this.mapManagementService.setRoute(res) }).subscribe(() => { });
    }
  }

  public click(event) {
    // const feature = this.map.forEachFeatureAtPixel(event.pixel,
    //   (feature) => { return feature; });
    // if (feature) {

    this.routingService.getNearestAdressNode(
      proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'),
      (nearest: Node) => {
        this.mapManagementService.removeRouteLayer();

        this.activeMarker = nearest;
        this.mapManagementService.drawMarker(this.activeMarker);
        MapManagementService.infos.changeInfo(this.activeMarker);
      });
  }
}
