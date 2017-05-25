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
import { StatusComponent } from './../../components/status/status.component';

import { Route } from './../../classes/route';
import { Node } from './../../classes/node';
import { BoundingBox } from './../../classes/bounding-box';

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
      StatusComponent.setStatus('my_location', 'loading start node');
      this.routingService.getNearestNodeOnStreet(
        new Node(this.position.coords.longitude, this.position.coords.latitude)
      ).subscribe(
        (res) => { this.routingService.startNode = res; },
        (err) => { StatusComponent.setError('while loading start node'); },
        () => {
          StatusComponent.setStatus('place', 'loading goal node');
          this.routingService.getNearestNodeOnStreet(
            this.activeMarker
          ).subscribe(
            (res) => { this.routingService.goalNode = res; },
            (err) => { StatusComponent.setError('while loading goal node'); },
            () => {
              StatusComponent.setStatus('get_app', 'load data');
              this.routingService.loadBoundingBoxes(
                BoundingBox.generateBBoxes(
                  this.routingService.startNode,
                  this.routingService.goalNode
                )
              ).subscribe(
                (res) => { },
                (err) => { StatusComponent.setError('while loading OSM data'); },
                () => {
                  StatusComponent.setStatus('cached', 'calculate route');
                  this.mapManagementService.setRoute(
                    this.routingService.dijkstra()
                  );
                  StatusComponent.hide();
                });

            });
        });
    }
  }

  public click(event) {
    StatusComponent.setStatus('place', 'loading nearest adress node');
    let position = proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
    this.routingService.getNearestAdressNode(
      position).subscribe((res) => {
        this.mapManagementService.removeRouteLayer();
        this.activeMarker = new Node(position[0], position[1]).calcNearestNodeFromList(res);
        this.mapManagementService.drawMarker(this.activeMarker);
        MarkerInformationService.infos.changeInfo(this.activeMarker);

      }, (err) => { StatusComponent.setError('no adress node nearby'); },
      () => { StatusComponent.hide();}
      );
  }
}
