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


  private startNode: Node;
  private goalNode: Node;
  private loadedBBoxes: BoundingBox[][];

  private static getDistToPoint(a: Node, b: Node): number {
    return Math.sqrt((a.lon - b.lon) * (a.lon - b.lon) + (a.lat - b.lat) * (a.lat - b.lat));
  }

  private static calcNearestNodeFromList(list: any, node: Node): Node {
    let nearest: Node = null;
    list.forEach(element => {
      if (element.type === 'node') {
        const tmpNode = new Node(element.lon, element.lat, element.id, element.tags);
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
    this.loadedBBoxes = [];
  }
  public getNearestAdressNode(a: number[], subscribe: Function): void {
    this.osmConnection.getNearestAdressNode(new Node(a[0], a[1]), 0.001).subscribe((res) => {
      subscribe(RoutingService.calcNearestNodeFromList(res, new Node(a[0], a[1])));
    });
  }

  public generateRoute(startMarker: Node, goalMarker: Node): Observable<Route> {
    this.loadBoundingBoxes(startMarker, goalMarker);
    const r: Route = new Route();
    return this.getNearestNodeOnStreet(startMarker).flatMap((res_start) => {
      this.startNode = res_start;
      return this.getNearestNodeOnStreet(goalMarker).map((res_goal) => {
        this.goalNode = res_goal;
      });
    }).map(() => {
      r.addNode(this.goalNode);
      r.addNode(this.startNode);
      return r;
    });
  }

  public getNearestNodeOnStreet(marker: Node): Observable<Node> {
    const returnValue: Node = null;
    return this.osmConnection
      .getNearestWayFromAdress(
      marker, 0.001)
      .map((res) => {
        return RoutingService.calcNearestNodeFromList(res, marker);
      });
  }
  public loadBoundingBoxes(start: Node, goal: Node): void {
    const sgSize = start.getDistToPoint(goal);
    const stepSize = 0.01;
    const stepVec = goal.sub(start).mul(stepSize / sgSize);

    let a = new Node(start.lon - stepVec.lat - stepVec.lon * 1.5, start.lat + stepVec.lon - stepVec.lat * 1.5);
    let d = new Node(start.lon + stepVec.lat - stepVec.lon * 1.5, start.lat - stepVec.lon - stepVec.lat * 1.5);
    let b = a.add(stepVec);
    let c = d.add(stepVec);

    // solange bis Ziel min. in erster hälfte von bbox
    // for (let i = 0; i * stepSize < sgSize + 0.5 * stepSize; i++) {
    //   a = b;
    //   d = c;
    //   b = b.add(stepVec);
    //   c = c.add(stepVec);
    //   console.log(new BoundingBox(a, b, c, d).toString());
    //   //console.log(a.lat + ' ' + a.lon + ' ' + b.lat + ' ' + b.lon + ' ' + c.lat + ' ' + c.lon + ' ' + d.lat + ' ' + d.lon);
    // }
    let i = 0;
    const request: Function = (() => {
      if (i * stepSize < sgSize + 0.5 * stepSize) {
        a = b;
        d = c;
        b = b.add(stepVec);
        c = c.add(stepVec);
        this.osmConnection.osmRequest('way[highway]', new BoundingBox(a, b, c, d)).subscribe((res) => {
          console.log(res.toString());
          i++;
          request();
        });
      }
    });
    request();
  }
}