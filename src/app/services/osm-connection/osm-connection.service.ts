import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Node } from './../../classes/node';
import { Edge } from './../../classes/edge';
import { Way } from './../../classes/way';
import { BoundingBox } from './../../classes/bounding-box';

@Injectable()
export class OsmConnectionService {

  public static savedNodes: { [key: string]: Node } = {};//Node[] = [];
  public static savedLines: Way[] = [];

  private osm_url = 'http://overpass-api.de/api//interpreter?data=[out:json];';

  private static getCoordBlock(node: Node, a: number): string {
    return '(' + (node.lat - a) + ',' + (node.lon - a) + ',' + (node.lat + a) + ',' + (node.lon + a) + ');';
  }

  constructor(private http: Http) { }

  public osmRequest(query: string, bbox: BoundingBox): Observable<void> {
    const time = new Date().getTime();
    return this.http.get(this.osm_url + query + bbox.toString() + '(._;>;);out;')
      .map((res) => {
        const elements = res.json().elements;
        elements.forEach(el => {
          if (el.type === 'node') {
            OsmConnectionService.savedNodes[el.id] = new Node(el.lon, el.lat, el.id, el.tags);
          } else if (el.type === 'way') {
            const way: Way = new Way(el.id, el.tags);
            way.addNode(OsmConnectionService.savedNodes[el.nodes[0]]);
            for (let i = 0; i < el.nodes.length - 1; i++) {
              way.addNode(OsmConnectionService.savedNodes[el.nodes[i + 1]]);
              // TODO: check el.tags.oneway
              OsmConnectionService.savedNodes[el.nodes[i]].edges.push(
                new Edge(OsmConnectionService.savedNodes[el.nodes[i + 1]], way)
              );
              OsmConnectionService.savedNodes[el.nodes[i + 1]].edges.push(
                new Edge(OsmConnectionService.savedNodes[el.nodes[i]], way)
              );
            }
            OsmConnectionService.savedLines.push(way);
          }
        });
        console.log('osmRequest time: ' + (new Date().getTime() - time) / 1000 + ' sec');
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