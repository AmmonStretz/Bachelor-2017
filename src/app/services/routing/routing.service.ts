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
    this.loadBoundingBox(startMarker);
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
  public loadBoundingBox(start: Node): void {
    let tmpNode: Node = start;
    const bboxes:BoundingBox[] = [];

    Observable.interval(10000).take(10)
      .flatMap((x) => Observable.timer(1000).map(() => x))
      .subscribe(x => {
        let bbox = BoundingBox.generateFromNode(tmpNode, 0.02);
        tmpNode = new Node(tmpNode.lon + 0.02, tmpNode.lat + 0.02, tmpNode.id);
        this.osmConnection.osmRequest('way[highway]', bbox).map((res) => {
          bboxes.push(res);
        }).subscribe(() => {
          console.log(bboxes);
        });
      });
    // this.osmConnection.osmRequest('way[highway]', bbox).map(x=>Observable.timer(20000)).map((res) => {
    //   return res;
    // }).subscribe((res) => {
    //   console.log(res.toString());
    // });
  }
}