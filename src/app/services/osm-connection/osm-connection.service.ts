import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

const osm_url = 'http://overpass-api.de/api/';

@Injectable()
export class OsmConnectionService {

  constructor(private http: Http) {
  }
  public getNearestNode(x: number, y: number, a: number): Observable<any> {

    const node = 'way[highway](' + (y - a) + ',' + (x - a) + ',' + (y + a) + ',' + (x + a) + ');';
    return this.http.get(osm_url + '/interpreter?data=[out:json];' + node + 'node(w);out;')
      .map((res) => {
        if (res.json().elements.length === 0) {
          this.getNearestNode(x, y, a + 0.0001).subscribe((r) => {
            return null;
          });
        } else {
          return res.json().elements;
        }
      });
  }
  public getNearestHighways(x: number, y: number, a: number): Observable<any> {

    const node = 'way[highway](' + (y - a) + ',' + (x - a) + ',' + (y + a) + ',' + (x + a) + ');';
    return this.http.get(osm_url + '/interpreter?data=[out:json];' + node + '(._;>;);out;')
      .map((res) => {
        if (res.json().elements.length === 0) {
          this.getNearestHighways(x, y, a + 0.0001).subscribe((r) => {
            return null;
          });
        } else {
          return res.json().elements;
        }
      });
  }
}