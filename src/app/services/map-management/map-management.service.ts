import { Injectable } from '@angular/core';
import { OnInit, ElementRef } from '@angular/core';
import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate, Overlay
} from 'openlayers';
import { RoutingService } from './../../services/routing/routing.service';
import { OsmConnectionService } from './../../services/osm-connection/osm-connection.service';
import { Constants } from './../../classes/constants';
import { Route } from './../../classes/route';
import { Node } from './../../classes/node';
import { InformationFieldComponent } from './../../components/information-field/information-field.component'

@Injectable()
export class MapManagementService {

  public static infos: InformationFieldComponent;

  public map: Map;
  private goalLayer: layer.Vector;
  private routeLayer: layer.Vector;
  public osmConnection: OsmConnectionService;
  public routingService: RoutingService;

  // public position: any;

  public followPosition = false;
  public followZoom = false;
  public followRotation = false;

  // public activeMarker = null;
  public markerOverlay = null;

  public static registerInformationField(infos: InformationFieldComponent) {
    this.infos = infos;
  }
  constructor(elementRef: ElementRef) {
    this.map = new Map({
      layers: [new layer.Tile({ source: new source.OSM() })],
      target: elementRef.nativeElement,
      view: new View({
        center: proj.fromLonLat([13.33962, 52.53250]),
        zoom: 18
      })
    });
  }

  private getDistToPoint(coord: any, x: number, y: number): number {
    return Math.sqrt((coord.lon - x) * (coord.lon - x) + (coord.lat - y) * (coord.lat - y));
  }

  public drawMarker(lon: number, lat: number): void {
    const marker = document.getElementById('marker');
    marker.style.display = 'block';
    const overlay = new Overlay({
      id: 1,
      position: proj.fromLonLat([lon, lat]),
      element: marker
    });
    // console.log(this.map.getOverlayById(1));
    this.map.removeOverlay(this.markerOverlay);
    this.map.addOverlay(overlay);
    this.markerOverlay = overlay;
  }

  public goToLocation(coords: Coordinates): void {
    this.map.getView().animate({
      center: proj.fromLonLat([coords.longitude, coords.latitude]),
      zoom: 18,
      duration: 2000
    });
  }

  public rotate(deg: number) {
    this.map.getView().animate({
      rotation: deg,
      duration: 2000
    });
  }

  public updatePosition(position: any): void {
    // this.position = position;
    const animation = {
      center: proj.fromLonLat([position.coords.longitude, position.coords.latitude]),
      zoom: 18,
      duration: 2000
    };
    if (position.coords.heading != null && this.followRotation) {
      animation['rotation'] = position.coords.heading;
    }
    if (this.followPosition) {
      this.map.getView().animate(animation);
    }
  }

  public setRoute(route: Route) {

    const l: layer.Vector = route.generateLayer();
    this.map.removeLayer(this.routeLayer);
    this.map.addLayer(l);
    this.routeLayer = l;

  }
  public removeRouteLayer(): void {
    if (this.routeLayer != null) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = null;
    }
  }
}
