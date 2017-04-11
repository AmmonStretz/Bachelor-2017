import { Injectable } from '@angular/core';
import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';
import { OsmConnectionService } from './../../services/osm-connection/osm-connection.service';

import { Route } from './../../classes/route';
import { Node } from './../../classes/node';
import { Constants } from './../../classes/constants';
@Injectable()
export class RoutingService {

  constructor(private osmConnectionService: OsmConnectionService){

  }
  private getDistToPoint(coord: any, x: number, y: number): number {
    return Math.sqrt((coord.lon - x) * (coord.lon - x) + (coord.lat - y) * (coord.lat - y));
  }
  public getNearestAdressNode(a: number[], subscribe: Function): void {
    this.osmConnectionService.getNearestAdressNode(a[0], a[1], 0.001).subscribe((res) => {
        let nearest = null;
        res.forEach(element => {
          if (nearest == null || this.getDistToPoint(nearest, a[0], a[1]) > this.getDistToPoint(element, a[0], a[1])) {
            nearest = element;
          }
        });
        subscribe(nearest);
      });
  }
  public generateRoute(start: Node, goal: Node): Route {
    let r: Route = new Route();
    r.addNode(start);
    r.addNode(goal);
    return r;
  }

}