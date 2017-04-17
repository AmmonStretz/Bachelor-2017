import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

const osm_url = 'http://overpass-api.de/api//interpreter?data=[out:json];';

@Injectable()
export class OsmConnectionService {

  private static getCoordBlock(x: number, y: number, a: number): string {
    return '(' + (y - a) + ',' + (x - a) + ',' + (y + a) + ',' + (x + a) + ');';
  }
  constructor(private http: Http) {
  }
  public getNearestWayFromAdress(x: number, y: number, a: number, postal_code: string, name: string) {
    const node = 'way[highway][postal_code="' + postal_code + '"]' +
      '[name="' + name + '"]' + OsmConnectionService.getCoordBlock(x, y, a);
    return this.http.get(osm_url + node + '(._;>;);out;')
      .map((res) => {
        if (res.json().elements.length > 0) {
          return res.json().elements;
        }
        return null;
      });
  }
  public getNearestAdressNode(x: number, y: number, a: number) {
    const node = 'node["addr:street"]' + OsmConnectionService.getCoordBlock(x, y, a);
    return this.http.get(osm_url + node + 'out;')
      .map((res) => {
        if (res.json().elements.length > 0) {
          return res.json().elements;
        }
        return null;
      });
  }
  public getNearestNode(x: number, y: number, a: number): Observable<any> {

    const node = 'way[highway]' + OsmConnectionService.getCoordBlock(x, y, a);
    return this.http.get(osm_url + node + 'node(w);out;')
      .map((res) => {
        if (res.json().elements.length > 0) {
          return res.json().elements;
        }
        return null;
      });
  }
  public getNearestHighways(x: number, y: number, a: number): Observable<any> {

    const node = 'way[highway]' + OsmConnectionService.getCoordBlock(x, y, a);
    return this.http.get(osm_url + node + '(._;>;);out;')
      .map((res) => {
        if (res.json().elements.length > 0) {
          return res.json().elements;
        }
        return null;
      });
  }
}