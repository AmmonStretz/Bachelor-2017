import { Injectable } from '@angular/core';
import { OnInit, ElementRef } from '@angular/core';
import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate, Overlay
} from 'openlayers';
import {InformationFieldComponent} from './../../components/information-field/information-field.component';
import { Constants } from './../../classes/constants';
import { Route } from './../../classes/route';
import { Node } from './../../classes/node';

@Injectable()
export class MapManagementService {

  public map: Map;
  private routeLayer: layer.Vector;
  private positionLayer: layer.Vector = new layer.Vector();
  public markerOverlay = null;

  constructor(elementRef: ElementRef) {
    this.map = new Map({
      layers: [new layer.Tile({ source: new source.OSM() })],
      target: elementRef.nativeElement,
      view: new View({
        center: proj.fromLonLat([0, 0]),
        projection: 'EPSG:3857',
        zoom: 18
      })
    });

    this.map.addLayer(this.positionLayer);

    navigator.geolocation.getCurrentPosition((pos) => {
      this.map.getView().setCenter(proj.fromLonLat([pos.coords.longitude, pos.coords.latitude]));
    });
  }

  private getDistToPoint(coord: any, x: number, y: number): number {
    return Math.sqrt((coord.lon - x) * (coord.lon - x) + (coord.lat - y) * (coord.lat - y));
  }

  public drawMarker(node: Node): void {
    this.removeRouteLayer();
    const marker = document.getElementById('marker');
    marker.style.display = 'block';
    const overlay = new Overlay({
      id: 1,
      position: proj.fromLonLat([node.lon, node.lat]),
      element: marker
    });
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
    
    const pl: layer.Vector = new layer.Vector({
      source: new source.Vector({
        features: [
          new Feature({
            geometry: new geom.Circle(
              proj.fromLonLat([position.coords.longitude, position.coords.latitude]), 0)
          })]
      }), style: Constants.locationPointStyle
    });

    this.map.removeLayer(this.positionLayer);
    this.map.addLayer(pl);
    this.positionLayer = pl;
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
