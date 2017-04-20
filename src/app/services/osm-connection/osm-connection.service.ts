import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Node } from './../../classes/node';
import { Route } from './../../classes/route';
import { BoundingBox } from './../../classes/bounding-box';

@Injectable()
export class OsmConnectionService {

  private osm_url = 'http://overpass-api.de/api//interpreter?data=[out:json];';

  private static getCoordBlock(node: Node, a: number): string {
    return '(' + (node.lat - a) + ',' + (node.lon - a) + ',' + (node.lat + a) + ',' + (node.lon + a) + ');';
  }
  constructor(private http: Http) {
  }
  public osmRequest(query: string, bbox: BoundingBox): Observable<BoundingBox> {
    const time = new Date().getTime();
    return this.http.get(this.osm_url + query + bbox.toString() + '(._;>;);out;')
      .map((res) => {
        const elements = res.json().elements;
        elements.forEach(el => {
          if (el.type === 'node') {
            bbox.nodes[el.id] = new Node(el.lon, el.lat, el.id, el.tags);
          } else if (el.type === 'way') {
            const route: Route = new Route(el.id, el.tags);
            el.nodes.forEach(id => {
              //vorhandensein testen !!!
              route.addNode(bbox.nodes[id]);
            });
            bbox.routes.push(route);
          }
        });
        console.log('osmRequest time: ' + (new Date().getTime() - time) / 1000 + ' sec');
        return bbox;
      });
  }

  public getNearestWayFromAdress(marker: Node, distance: number): Observable<any> {
    let filter = 'way[highway]';
    console.log('marker: ' + marker.tags['addr:postcode']);
    if (marker.tags['addr:postcode']) {
      filter += '[postal_code="' + marker.tags['addr:postcode'] + '"]';
    }

    if (marker.tags['addr:name']) {
      filter += '[name="' + marker.tags['addr:name'] + '"]';
    }
    filter += OsmConnectionService.getCoordBlock(marker, distance);
    return this.http.get(this.osm_url + filter + '(._;>;);out;')
      .map((res) => {
        if (res.json().elements.length > 0) {
          return res.json().elements;
        }
        return null;
      });
  }
  public getNearestAdressNode(node: Node, a: number): Observable<any> {
    const filter = 'node["addr:street"]' + OsmConnectionService.getCoordBlock(node, a);
    return this.http.get(this.osm_url + filter + '(._;>;);out;')
      .map((res) => {
        if (res.json().elements.length > 0) {
          return res.json().elements;
        }
        return null;
      });
  }
  // public getNearestNode(node: Node, a: number): Observable<any> {

  //   const filter = 'way[highway]' + OsmConnectionService.getCoordBlock(node, a);
  //   return this.http.get(this.osm_url + filter + 'node(w);out;')
  //     .map((res) => {
  //       if (res.json().elements.length > 0) {
  //         return res.json().elements;
  //       }
  //       return null;
  //     });
  // }
  // public getNearestHighways(node: Node, a: number): Observable<any> {

  //   const filter = 'way[highway]' + OsmConnectionService.getCoordBlock(node, a);
  //   return this.http.get(this.osm_url + filter + '(._;>;);out;')
  //     .map((res) => {
  //       if (res.json().elements.length > 0) {
  //         return res.json().elements;
  //       }
  //       return null;
  //     });
  // }
}