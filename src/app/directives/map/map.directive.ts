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
import { MarkerInformationService } from './../../services/marker-information/marker-information.service';


import { Route } from './../../classes/route';
import { Node } from './../../classes/node';

@Directive({
  selector: '[map]'
})
export class MapDirective {

  mapManagementService: MapManagementService;
  routingService: RoutingService;
  public position: any;
  public activeMarker: Node = null;

  constructor(elementRef: ElementRef, private osmConnection: OsmConnectionService) {
    this.mapManagementService = new MapManagementService(elementRef);
    this.routingService = new RoutingService(osmConnection);

    let d: MapDirective = this;
    // onClick Listener added
    this.mapManagementService.map.on('click', function (event) {
      d.click(event);
    });

    // Position Listener added
    navigator.geolocation.watchPosition((position) => {
      this.position = position;
      this.mapManagementService.updatePosition(position);
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
      let start: Node;
      let goal: Node;
      this.routingService.getNearestNodeOnStreet(
        new Node(this.position.coords.longitude, this.position.coords.latitude)
      ).subscribe(
        (res) => { start = res; },
        (err) => { },
        () => {
          console.log('set start node');
          this.routingService.getNearestNodeOnStreet(
            this.activeMarker
          ).subscribe(
            (res) => { goal = res; },
            (err) => { },
            () => {
              console.log('set goal node');
              this.routingService.loadBoundingBoxes(
                this.routingService.generateBBoxes(start, goal)
              ).subscribe(
                () => { },
                () => { },
                () => {
                  console.log('bboxes loaded');
                  this.mapManagementService.setRoute(
                    this.routingService.generateRoute(start, goal)
                  );
                });

            });
        });
    }
  }

  public click(event) {
    this.routingService.getNearestAdressNode(
      proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326'),
      (nearest: Node) => {
        this.mapManagementService.removeRouteLayer();

        this.activeMarker = nearest;
        this.mapManagementService.drawMarker(this.activeMarker);
        MarkerInformationService.infos.changeInfo(this.activeMarker);
      });
  }
}
