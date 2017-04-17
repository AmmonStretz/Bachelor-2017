import { Directive, ElementRef } from '@angular/core';
import {
  Map, View, Tile, layer, source, control,
  Coordinate, interaction, geom, proj, format, style, Feature, coordinate
} from 'openlayers';
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
    // this.map.on('pointermove', function (event) {
    //   const feature = d.map.forEachFeatureAtPixel(event.pixel,
    //   (feature: Feature) => { return feature; });
    //   if(feature){
    //     console.log(feature);
    //   }
    // });

    // Position Listener added
    navigator.geolocation.watchPosition((position) => {
      this.position = position;
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
    if (this.activeMarker) {
      this.routingService.getNearestPointOnStreet(this.activeMarker);
      this.mapManagementService.setRoute(this.routingService.generateRoute(
        new Node(null, this.position.coords.longitude, this.position.coords.latitude),
        new Node(this.activeMarker.id, this.activeMarker.lon, this.activeMarker.lat)
      ));
    }
  }

  public click(event) {
      console.log(this.activeMarker);
    const feature = this.map.forEachFeatureAtPixel(event.pixel,
      (feature) => { return feature; });
    if (feature) {
      console.log("You clicked on it");
    } else {
      // set new Endpoint
      const coord = proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
      this.routingService.getNearestAdressNode(coord, (nearest) => {
        this.mapManagementService.removeRouteLayer();

        this.activeMarker = new Node(nearest.id, nearest.lon, nearest.lat, nearest.tags);
        this.mapManagementService.drawMarker([this.activeMarker.lon, this.activeMarker.lat]);
        MapManagementService.infos.changeInfo(this.activeMarker);
      });
      // MapManagementService.setMarker(a[0], a[1]);
    }
  }
  private getDistToPoint(coord: any, x: number, y: number): number {
    return Math.sqrt((coord.lon - x) * (coord.lon - x) + (coord.lat - y) * (coord.lat - y));
  }
}
