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

  public static filters: string = '';
  public static ratings = [];
  private startNode: Node;
  private goalNode: Node;
  private loadedBBoxes: BoundingBox[][] = [];

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

  constructor(private osmConnection: OsmConnectionService) { }

  public getNearestAdressNode(a: number[], subscribe: Function): void {
    this.osmConnection.getNearestAdressNode(new Node(a[0], a[1]), 0.001).subscribe((res) => {
      subscribe(RoutingService.calcNearestNodeFromList(res, new Node(a[0], a[1])));
    });
  }

  public generateRoute(start: Node, goal: Node): Route {
    console.log('routing');

    // console.log('startid: ' + start.id);
    // console.log('goalid: ' + goal.id);
    // console.log();
    let r: Route = new Route();

    let nodesQueue: Node[] = [];
    let visitedNodes: Node[] = [];
    OsmConnectionService.savedNodes[start.id].distance = 0;
    for (let k in OsmConnectionService.savedNodes) {
      if (OsmConnectionService.savedNodes.hasOwnProperty(k)) {
        nodesQueue.push(OsmConnectionService.savedNodes[k]);
      }
    }

    while (nodesQueue.length > 0) {
      // console.log(nodesQueue.length + ' ' + visitedNodes.length);
      let nearestId = null;
      for (let i = 0; i < nodesQueue.length; i++) {
        if (
          nearestId == null || nodesQueue[i].distance < nodesQueue[nearestId].distance) {
          nearestId = i;
        }
      }
      const pointer: Node = nodesQueue.splice(nearestId, 1)[0];
      console.log(nodesQueue.length + ' ' + visitedNodes.length + ' ' + pointer.distance);
      // if(pointer.id = 4453196450){
      //   console.log(pointer);
      // }
      if (pointer.distance == Infinity) { break; }
      visitedNodes.push(pointer);

      // console.log(pointer.id);
      pointer.edges.forEach(edge => {
        const tmpDist: number = pointer.distance + pointer.getDistToPoint(edge.node);
        if (edge.node.distance > tmpDist) {
          edge.node.distance = tmpDist;
          edge.node.predecessor_id = pointer.id;
        }
      });
    }

    // console.log(visitedNodes);
    // console.log(nodesQueue);
    // TODO Bugfixing
    let p: Node = OsmConnectionService.savedNodes[goal.id];
    r.addNode(p);
    while (p.predecessor_id != start.id) {
      console.log(p);
      p = OsmConnectionService.savedNodes[p.predecessor_id];
      r.addNode(p);
    }
    r.routeNodes.reverse();
    return r;

  }

  public getNearestNodeOnStreet(marker: Node): Observable<Node> {
    const returnValue: Node = null;
    return this.osmConnection
      .getWayFromAdress(
      marker, 0.001)
      .map((res) => {
        return RoutingService.calcNearestNodeFromList(res, marker);
      });
  }
  public loadBoundingBoxes(notLoadedBBoxes: BoundingBox[]): Observable<Node[]> {
    const filter = 'way[highway][bicycle!="no"]'+RoutingService.filters;

    return Observable.create((obs: Observer<Observable<any>>) => {
      notLoadedBBoxes.forEach(bbox => {
        obs.next(this.osmConnection.loadBoundingBox(filter, bbox));
      });
      obs.complete();
    }).flatMap((res) => {
      return res;
    }).delay(10000).map((res) => {
      return OsmConnectionService.savedNodes;
    })
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