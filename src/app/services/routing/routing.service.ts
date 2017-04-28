import { Injectable } from '@angular/core';
import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
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

  public generateRoute(startMarker: Node, goalMarker: Node): Route {
    //  var controls: { [key: string]: string } = {};
    // controls['14123414'] = "aaa";
    // controls['12341515'] = "bbb";
    // controls['35635636'] = "ccc";
    // controls['46746776'] = "ddd";
    // controls['57957959'] = "eee";
    let a = new Date().getTime();
    let b = new Date().getTime();
    let i = 1;
    for (var k in OsmConnectionService.savedNodes) {
      if (OsmConnectionService.savedNodes.hasOwnProperty(k)) {
        a = new Date().getTime() - a;
        console.log(OsmConnectionService.savedNodes[k].id + ' ' + a +' '+ i++);
        a = new Date().getTime();
      }
    }
    console.log('time: ' + (new Date().getTime() - b));
    console.log(OsmConnectionService.savedNodes);
    // OsmConnectionService.savedNodes.forEach(element => {
    //   console.log(element.id);
    // });
    // console.log(OsmConnectionService.savedNodes);
    const r: Route = new Route();
    r.addNode(startMarker);
    r.addNode(goalMarker);
    return r;

    // return this.getNearestNodeOnStreet(startMarker).flatMap((res_start) => {
    //   this.startNode = res_start;
    //   return this.getNearestNodeOnStreet(goalMarker).map((res_goal) => {
    //     this.goalNode = res_goal;
    //   });
    // }).flatMap((a) => {
    //   return this.loadBBoxes(this.generateBBoxes(startMarker, goalMarker)).map((res) => {
    //     return res;
    //   });
    // }).map((res) => {
    //   console.log('res: ');
    //   console.log(res);

    //   r.addNode(this.goalNode);
    //   r.addNode(res['2824824744']);
    //   r.addNode(this.startNode);
    //   // console.log(res[this.startNode.id]);
    //   return r;
    // });
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
  public loadBBoxes(notLoadedBBoxes: BoundingBox[]): Observable<Node[]> {
    const filter = 'way[highway]';

    return Observable.create((obs: Observer<Observable<any>>) => {
      notLoadedBBoxes.forEach(bbox => {
        obs.next(this.osmConnection.osmRequest(filter, bbox));
      });
      obs.complete();
    }).flatMap((res) => {
      return res;
    }).delay(10000).map((res) => {
      return OsmConnectionService.savedNodes;
    })
    // return Observable.create((obs: Observer<Observable<any>>) => {
    //   notLoadedBBoxes.forEach(bbox => {
    //     obs.next(this.osmConnection.osmRequest(filter, bbox));
    //   });
    //   obs.complete();
    // }).flatMap((res) => {
    //   return res;
    // }).map((res) => {
    //   return OsmConnectionService.savedNodes;
    // }).do((res)=>{
    //   return res;
    // });
  }
  public generateBBoxes(start: Node, goal: Node): BoundingBox[] {
    const boxes: BoundingBox[] = [];
    const sgDist = start.getDistToPoint(goal);
    const stepSize = 0.01;
    const stepVec = goal.sub(start).mul(stepSize / sgDist);

    let a = new Node(start.lon - stepVec.lat - stepVec.lon * 1.5, start.lat + stepVec.lon - stepVec.lat * 1.5);
    let d = new Node(start.lon + stepVec.lat - stepVec.lon * 1.5, start.lat - stepVec.lon - stepVec.lat * 1.5);
    let b = a.add(stepVec);
    let c = d.add(stepVec);
    boxes.push(new BoundingBox(a, b, c, d));
    for (let j = 0; j * stepSize < sgDist + 0.5 * stepSize; j++) {
      a = b;
      d = c;
      b = b.add(stepVec);
      c = c.add(stepVec);
      boxes.push(new BoundingBox(a, b, c, d));
    }
    return boxes;
  }
}