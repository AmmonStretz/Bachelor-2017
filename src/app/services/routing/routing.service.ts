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
import { SettingsComponent } from './../../components/settings/settings.component';

@Injectable()
export class RoutingService {

  constructor(private osmConnection: OsmConnectionService) { }

  public dijkstra(start: Node, goal: Node): Route {

    const S: Node[] = [];
    const Q: Node[] = [];

    let s: Node = new Node(Infinity, Infinity);
    let g: Node = new Node(Infinity, Infinity);
    for (const k in OsmConnectionService.savedNodes) {
      if (OsmConnectionService.savedNodes.hasOwnProperty(k)) {
        Q.push(OsmConnectionService.savedNodes[k]);
        if (start.getDistToPoint(s) >
          start.getDistToPoint(OsmConnectionService.savedNodes[k])) {
          s = OsmConnectionService.savedNodes[k];
        }
        if (goal.getDistToPoint(g) >
          goal.getDistToPoint(OsmConnectionService.savedNodes[k])) {
          g = OsmConnectionService.savedNodes[k];
        }
      }
    }
    OsmConnectionService.savedNodes[s.id].distance = 0;

    let u: Node = new Node(0, 0);
    while (Q.length > 0 && u.id !== g.id) {
      u = this.extractMin(Q);
      S.push(u);
      u.weighNeighbors(SettingsComponent.filteredSettings);
    }
    return this.generateRoute(s, g);
  }

  private extractMin(Q: Node[]) {
    let nearestId = null;
    for (let i = 0; i < Q.length; i++) {
      if (
        nearestId == null || Q[i].distance < Q[nearestId].distance) {
        nearestId = i;
      }
    }
    return Q.splice(nearestId, 1)[0];
  }

  private generateRoute(s: Node, g: Node): Route {
    const r: Route = new Route();
    let p: Node = OsmConnectionService.savedNodes[g.id];
    r.addNode(p);
    while (p.predecessor_id !== s.id) {
      // console.log(p);
      p = OsmConnectionService.savedNodes[p.predecessor_id];
      r.addNode(p);
    }
    r.routeNodes.reverse();
    return r;
  }

  public loadBBoxes(bboxes: BoundingBox[], final: Function) {
    const filter = 'way[highway][bicycle!="no"]' + SettingsComponent.filters;
    this.osmConnection.loadBoundingBox(filter, bboxes.splice(0, 1)[0]).subscribe(
      (res) => { }, (exc) => { },
      () => {
        if (bboxes.length > 0) {
          this.loadBBoxes(bboxes, final);
        } else {
          final();
        }
      });
  }

  /* loads data asynchrone */
  public loadBoundingBoxes(notLoadedBBoxes: BoundingBox[]): Observable<Node[]> {
    const filter = 'way[highway][bicycle!="no"]' + SettingsComponent.filters;

    return Observable.create((obs: Observer<Observable<any>>) => {
      notLoadedBBoxes.forEach(bbox => {
        obs.next(this.osmConnection.loadBoundingBox(filter, bbox));
      });
      obs.complete();
    }).flatMap((res) => { return res; })
      .map((res) => { return OsmConnectionService.savedNodes; });
  }
}
