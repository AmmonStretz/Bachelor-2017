import { Injectable } from '@angular/core';
import { OnInit, ElementRef } from '@angular/core';
import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, coordinate
} from 'openlayers';

@Injectable()
export class MapManagementService {

  private static map: Map;
  private static goalLayer: layer.Vector;
  // public static osmConnection: OsmConnectionService;

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

}