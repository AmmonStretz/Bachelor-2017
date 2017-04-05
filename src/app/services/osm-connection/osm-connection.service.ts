import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

const osm_url = 'http://overpass-api.de/api//interpreter?data=[out:json];';

@Injectable()
export class OsmConnectionService {

  constructor(private http: Http) {
  }
  public getNearestWayFromAdress(x: number, y: number, a: number, postal_code: string, name: string) {
    const node = 'way[highway][postal_code="' + postal_code + '"]'+
    '[name="' + name + '"](' + (y - a) + ',' + (x - a) + ',' + (y + a) +
    ',' + (x + a) + ');';
    return this.http.get(osm_url + node + 'out;')
      .map((res) => {
        if (res.json().elements.length === 0) {
          this.getNearestWayFromAdress(x, y, a + 0.0001, postal_code, name).subscribe((r) => {
            return null; //TODO erweiterung des Suchbereichs
          });
        } else {
          return res.json().elements;
        }
      });
  }
  public getNearestAdressNode(x: number, y: number, a: number) {
    const node = 'node["addr:street"](' + (y - a) + ',' + (x - a) + ',' + (y + a) + ',' + (x + a) + ');';
    return this.http.get(osm_url + node + 'out;')
      .map((res) => {
        if (res.json().elements.length === 0) {
          this.getNearestAdressNode(x, y, a + 0.0001).subscribe((r) => {
            return null; //TODO erweiterung des Suchbereichs
          });
        } else {
          return res.json().elements;
        }
      });
  }
  public getNearestNode(x: number, y: number, a: number): Observable<any> {

    const node = 'way[highway](' + (y - a) + ',' + (x - a) + ',' + (y + a) + ',' + (x + a) + ');';
    return this.http.get(osm_url + node + 'node(w);out;')
      .map((res) => {
        if (res.json().elements.length === 0) {
          this.getNearestNode(x, y, a + 0.0001).subscribe((r) => {
            return null; //TODO erweiterung des Suchbereichs
          });
        } else {
          return res.json().elements;
        }
      });
  }
  public getNearestHighways(x: number, y: number, a: number): Observable<any> {

    const node = 'way[highway](' + (y - a) + ',' + (x - a) + ',' + (y + a) + ',' + (x + a) + ');';
    return this.http.get(osm_url + node + '(._;>;);out;')
      .map((res) => {
        if (res.json().elements.length === 0) {
          this.getNearestHighways(x, y, a + 0.0001).subscribe((r) => {
            return null; //TODO erweiterung des Suchbereichs
          });
        } else {
          return res.json().elements;
        }
      });
  }
}