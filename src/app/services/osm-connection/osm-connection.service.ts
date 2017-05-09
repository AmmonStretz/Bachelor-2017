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

  public static savedNodes: { [key: string]: Node } = {};

  private osm_url = 'http://overpass-api.de/api//interpreter?data=[out:json];';

  private static getCoordBlock(node: Node, a: number): string {
    return '(' + (node.lat - a) + ',' + (node.lon - a) + ',' + (node.lat + a) + ',' + (node.lon + a) + ');';
  }

  constructor(private http: Http) { }

  public loadBoundingBox(query: string, bbox: BoundingBox): Observable<void> {
    const time = new Date().getTime();
    return this.http.get(this.osm_url + query + bbox.toString() + '(._;>;);out;')
      .map((res) => {
        const elements = res.json().elements;
        elements.forEach(el => {
          if (el.type === 'node') {
            OsmConnectionService.savedNodes[el.id] = new Node(el.lon, el.lat, el.id, el.tags);
          } else if (el.type === 'way') {
            const way: Way = new Way(el.id, el.tags);
            for (let i = 0; i < el.nodes.length - 1; i++) { // TODO: check el.tags.oneway
              OsmConnectionService.savedNodes[el.nodes[i]].edges.push(
                new Edge(OsmConnectionService.savedNodes[el.nodes[i + 1]], way)
              );
              OsmConnectionService.savedNodes[el.nodes[i + 1]].edges.push(
                new Edge(OsmConnectionService.savedNodes[el.nodes[i]], way)
              );
            }
          }
        });
        console.log('osmRequest time: ' + (new Date().getTime() - time) / 1000 + ' sec');
      });
  }

  public getWayFromAdress(center: Node, distance: number): Observable<any> {
    let filter = 'way[highway]';
    filter += (center.tags['addr:postcode']) ?
      '[postal_code="' + center.tags['addr:postcode'] + '"]' : '';

    filter += (center.tags['addr:name']) ?
      '[name="' + center.tags['addr:name'] + '"]' : '';

    filter += OsmConnectionService.getCoordBlock(center, distance);
    return this.http.get(this.osm_url + filter + '(._;>;);out;')
      .map((res) => res.json().elements);
  }
  public getNearestAdressNode(node: Node, distance: number): Observable<any> {
    const filter = 'node["addr:street"]' +
      OsmConnectionService.getCoordBlock(node, distance);
    return this.http.get(this.osm_url + filter + '(._;>;);out;')
      .map((res) => res.json().elements);
  }
}