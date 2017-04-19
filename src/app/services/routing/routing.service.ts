import { Injectable } from '@angular/core';
import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';
import { OsmConnectionService } from './../../services/osm-connection/osm-connection.service';

import { Route } from './../../classes/route';
import { Node } from './../../classes/node';
import { BoundingBox } from './../../classes/bounding-box';
import { Constants } from './../../classes/constants';

@Injectable()
export class RoutingService {

  private static getDistToPoint(a: Node, b: Node): number {
    return Math.sqrt((a.lon - b.lon) * (a.lon - b.lon) + (a.lat - b.lat) * (a.lat - b.lat));
  }

  private static calcNearestNodeFromList(list: any, node: Node): Node {
    let nearest: Node = null;
    list.forEach(element => {
      if (element.type === 'node') {
        const tmpNode = new Node(null, element.lon, element.lat, element.tags);
        if (nearest == null ||
          RoutingService.getDistToPoint(nearest, node) >
          RoutingService.getDistToPoint(tmpNode, node)) {
          nearest = tmpNode;
        }
      }
    });
    return nearest;
  }

  constructor(private osmConnection: OsmConnectionService) {

  }
  public getNearestAdressNode(a: number[], subscribe: Function): void {
    this.osmConnection.getNearestAdressNode(a[0], a[1], 0.001).subscribe((res) => {
      subscribe(RoutingService.calcNearestNodeFromList(res, new Node(null, a[0], a[1])));
    });
  }

  public generateRoute(start: Node, goal: Node): Observable<Route> {
    let r: Route = new Route();
    return this.getNearestPointOnStreet(start).flatMap((res_start)=>{
      return this.getNearestPointOnStreet(goal).map((res_goal)=>{
        r.addNode(res_start);
        r.addNode(res_goal);
        return r;
      });
    })
    // this.getNearestPointOnStreet(start).toPromise().then((res_start) => {
    //   r.addNode(res_start);
    //   return this.getNearestPointOnStreet(goal).toPromise().then((res_goal) => {
    //     r.addNode(res_goal);
    //   });
    // }).then((res)=>{
    //   console.log('res');
    //   console.log(res);
    //   console.log(r);
    // });

    // return this.getNearestPointOnStreet(start).map((res) => {
    //   r.addNode(res);
    //   // this.getNearestPointOnStreet(goal).map((resp)=>{})
    //   r.addNode(goal);
    //   return r;
    // });
  }

  public getNearestPointOnStreet(marker: Node): Observable<Node> {
    let returnValue: Node = null;
    return this.osmConnection
      .getNearestWayFromAdress(
      marker, 0.001)
      .map((res) => {
        return RoutingService.calcNearestNodeFromList(res, marker);
      });
  }

}