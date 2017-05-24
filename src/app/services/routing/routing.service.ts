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
import { Setting } from './../../classes/setting';

@Injectable()
export class RoutingService {

  public static filters = '';
  public static ratings: Setting[] = [];
  public startNode: Node;
  public goalNode: Node;
  private boxSize = 0.001;

  constructor(private osmConnection: OsmConnectionService) { }

  public getNearestAdressNode(a: number[]) {
    return this.osmConnection.getAdressNodes(new Node(a[0], a[1]), this.boxSize);
  }

  public generateRoute(): Route {

    const r: Route = new Route();
    const nodesQueue: Node[] = [];
    const visitedNodes: Node[] = [];

    OsmConnectionService.savedNodes[this.startNode.id].distance = 0;
    for (let k in OsmConnectionService.savedNodes) {
      if (OsmConnectionService.savedNodes.hasOwnProperty(k)) {
        nodesQueue.push(OsmConnectionService.savedNodes[k]);
      }
    }
    console.log(OsmConnectionService.savedNodes);
    console.log(nodesQueue);

    let count = 0;
    let pointer: Node = OsmConnectionService.savedNodes[this.startNode.id];
    while (nodesQueue.length > 0) {
      count++;
      // console.log(nodesQueue.length + ' ' + visitedNodes.length);
      let nearestId = null;
      for (let i = 0; i < nodesQueue.length; i++) {
        if (
          nearestId == null || nodesQueue[i].distance < nodesQueue[nearestId].distance) {
          nearestId = i;
        }
      }
      pointer = nodesQueue.splice(nearestId, 1)[0];

      // if (pointer.distance == Infinity) { break; }
      visitedNodes.push(pointer);

      pointer.edges.forEach(edge => {
        const tmpDist: number = pointer.distance + pointer.getEdgeWeight(edge, RoutingService.ratings);
        if (edge.node.distance > tmpDist) {
          edge.node.distance = tmpDist;
          edge.node.predecessor_id = pointer.id;
        }
      });
    }
    console.log('Number of Dijkstra-Loops: ' + count);

    let p: Node = OsmConnectionService.savedNodes[this.goalNode.id];
    r.addNode(p);
    while (p.predecessor_id !== this.startNode.id) {
      console.log(p);
      p = OsmConnectionService.savedNodes[p.predecessor_id];
      r.addNode(p);
    }
    r.routeNodes.reverse();
    return r;

  }

  public getNearestNodeOnStreet(marker: Node): Observable<Node> {
    return this.osmConnection
      .getWayFromAdress(marker, this.boxSize)
      .map((res) => {
        return marker.calcNearestNodeFromList(res);
      });
  }

  public loadBoundingBoxes(notLoadedBBoxes: BoundingBox[]): Observable<Node[]> {
    const filter = 'way[highway][bicycle!="no"]' + RoutingService.filters;

    return Observable.create((obs: Observer<Observable<any>>) => {
      notLoadedBBoxes.forEach(bbox => {
        obs.next(this.osmConnection.loadBoundingBox(filter, bbox));
      });
      obs.complete();
    }).flatMap((res) => { return res;})
    .map((res) => { return OsmConnectionService.savedNodes; });
  }
}
