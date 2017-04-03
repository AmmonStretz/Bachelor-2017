import { Injectable } from '@angular/core';
import { OnInit, ElementRef } from '@angular/core';
import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, coordinate
} from 'openlayers';
import { OsmConnectionService } from './../../services/osm-connection/osm-connection.service';
import { Constants } from './../../classes/constants';

@Injectable()
export class MapManagementService {

  private static map: Map;
  private static goalLayer: layer.Vector;
  public static osmConnection: OsmConnectionService;

  public static position: any;

  //map modes
  public static followPosition = true;
  public static followZoom = false;
  public static followRotation = true;

  public static getMapInstance(elementRef: ElementRef): Map {
    if (MapManagementService.map == null) {
      MapManagementService.map = new Map({
        layers: [
          new layer.Tile({
            source: new source.OSM()
          })
        ],
        target: elementRef.nativeElement,
        view: new View({
          center: proj.fromLonLat([13.33962, 52.53250]),
          zoom: 18
        })
      });
    }
    return MapManagementService.map;
  }

  private static getDistToPoint(coord: any, x: number, y: number): number {
    return Math.sqrt((coord.lon - x) * (coord.lon - x) + (coord.lat - y) * (coord.lat - y));
  }

  public static setMarker(x: number, y: number) {
    let nearest = null;

    this.osmConnection.getNearestNode(x, y, 0.0005).subscribe((res) => {
      res.forEach(element => {
        if (nearest == null) {
          nearest = element;
        } else {
          let dist01 = this.getDistToPoint(element, x, y);
          let dist02 = this.getDistToPoint(nearest, x, y);
          if (dist01 < dist02) {
            nearest = element;
          }
        }
      });

      if (nearest == null) {
        console.log("no element");
        nearest = {
          "type": "node",
          "lat": y,
          "lon": x
        };
      }
      this.drawMarker(nearest.lon, nearest.lat);
    });
    this.osmConnection.getNearestHighways(x, y, 0.0005).subscribe((res) => {
      let nodes = [];
      let ways = [];
      res.forEach(element => {
        if (element.type == "node") {
          nodes[element.id] = element;
          console.log("node");
        } else if (element.type == "way") {
          console.log("way");
          ways[element.id] = element;
          for (let i = 0; i < element.nodes.length - 1; i++) {
            let a = { x: parseFloat(nodes[element.nodes[i]].lon), y: parseFloat(nodes[element.nodes[i]].lat) };
            let b = { x: parseFloat(nodes[element.nodes[i + 1]].lon), y: parseFloat(nodes[element.nodes[i + 1]].lat) };
            let k = (x * (b.x - a.x) - a.x * (b.x - a.x) + y * (b.y - a.y) - a.y * (b.y - a.y)) / ((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
            if (k > 0 && k < 1) {
              console.log(k);
              this.drawMarker(a.x + k * (b.x - a.x), a.y + k * (b.y - a.y));
            }
          }
        }
        // console.log(element.type);
      });
    });
  }

  public static drawMarker(lon: number, lat: number): void {
    let vector = new layer.Vector();
    vector.setStyle(Constants.pointStyle);
    vector.setSource(new source.Vector({
      features: [
        new Feature({
          geometry: new geom.Circle(proj.fromLonLat([lon, lat]), 10),
          labelPoint: new geom.Point(proj.fromLonLat([lon, lat])),
          name: 'goalMarker'
        })]
    }));
    this.map.removeLayer(this.goalLayer);
    this.map.addLayer(vector);
    this.goalLayer = vector;
  }

  public static panToLocation(): void {
    if (this.position != null) {
      this.map.getView().animate({
        center: proj.fromLonLat([MapManagementService.position.coords.longitude, MapManagementService.position.coords.latitude]),
        zoom: 18,
        duration: 2000
      });
    }
  }

  public static panToRotation(): void {
    console.log(this.map.getView().getRotation());
    let goalRotation = 0;
    if (this.position.coords.heading != null) {
      goalRotation = this.position.coords.heading;
    }
    this.map.getView().animate({
      rotation: goalRotation,
      duration: 2000
    });
  }

  public static updatePosition(position: any): void {
    this.position = position;
    const animation = {};
    animation['center'] = proj.fromLonLat([position.coords.longitude, position.coords.latitude]);
    animation['zoom'] = 18;
    animation['duration'] = 2000;
    if (position.coords.heading != null && this.followRotation) {
      animation['rotation'] = position.coords.heading;
    }
    if (this.followPosition) {
      this.map.getView().animate(animation);
    }
  }
}
