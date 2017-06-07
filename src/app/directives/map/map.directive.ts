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
import { InformationFieldComponent } from './../../components/information-field/information-field.component'

import { StatusComponent } from './../../components/status/status.component';

import { Route } from './../../classes/route';
import { Node } from './../../classes/node';
import { BoundingBox } from './../../classes/bounding-box';

@Directive({
  selector: '[map]'
})
export class MapDirective {

  public static infos: InformationFieldComponent;

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
    if (this.activeMarker && this.position) {
      const pos = new Node(this.position.coords.longitude, this.position.coords.latitude);
      StatusComponent.setStatus('get_app', 'load data');
      this.routingService.loadBBoxes(
        BoundingBox.generateBBoxes(pos, this.activeMarker),
        () => {
          StatusComponent.setStatus('cached', 'calculate route');
          this.mapManagementService.setRoute(
            this.routingService.dijkstra(pos, this.activeMarker)
          );
          StatusComponent.hide();
        }
      );
    }
  }

  public click(event) {
    StatusComponent.setStatus('place', 'loading nearest adress node'); // <- status
    const pos = proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
    this.osmConnection.getAdressNodes(new Node(pos[0], pos[1]), 0.001)
      .subscribe((res) => {
        this.mapManagementService.removeRouteLayer();
        this.activeMarker = new Node(pos[0], pos[1]).calcNearestNodeFromList(res);
        this.mapManagementService.drawMarker(this.activeMarker);
        MapDirective.infos.changeInfo(this.activeMarker);
      }, (err) => {
        StatusComponent.setError('no adress node nearby'); // <- status
      }, () => {
        StatusComponent.hide(); // <- status
      });
  }

}
