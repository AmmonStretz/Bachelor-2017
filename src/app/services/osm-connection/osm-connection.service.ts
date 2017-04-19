import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { Node } from './../../classes/node';

const osm_url = 'http://overpass-api.de/api//interpreter?data=[out:json];';

@Injectable()
export class OsmConnectionService {

  private static getCoordBlock(x: number, y: number, a: number): string {
    return '(' + (y - a) + ',' + (x - a) + ',' + (y + a) + ',' + (x + a) + ');';
  }
  constructor(private http: Http) {
  }
  //marker.lon, marker.lat, 0.02, marker.tags['addr:postcode'], marker.tags['addr:street']

  public getNearestWayFromAdress(marker: Node, distance: number){
    let request_string = 'way[highway]';
    if(marker.tags['addr:postcode']){
      request_string += '[postal_code="' + marker.tags['addr:postcode'] + '"]';
    }

    if(marker.tags['addr:name']){
      request_string += '[name="' + marker.tags['addr:name'] + '"]';
    }
    request_string += OsmConnectionService.getCoordBlock(marker.lon, marker.lat, distance);
    return this.http.get(osm_url + request_string + '(._;>;);out;')
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