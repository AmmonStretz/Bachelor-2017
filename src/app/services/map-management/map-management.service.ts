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

  private static infos: InformationFieldComponent;

  public map: Map;
  private goalLayer: layer.Vector;
  private routeLayer: layer.Vector;
  public osmConnection: OsmConnectionService;
  public routingService: RoutingService;

  public position: any;

  public followPosition = false;
  public followZoom = false;
  public followRotation = false;

  public activeMarker = null;
  public markerOverlay = null;

  public static registerInformationField(infos: InformationFieldComponent) {
    this.infos = infos;
  }
  constructor(elementRef: ElementRef){
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

  public panToLocation(): void {
    if (this.position != null) {
      this.map.getView().animate({
        center: proj.fromLonLat([this.position.coords.longitude, this.position.coords.latitude]),
        zoom: 18,
        duration: 2000
      });
    }
  }

  public panToRotation(): void {
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

  public updatePosition(position: any): void {
    this.position = position;
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

  public setRoute() {
    if (this.activeMarker) {
      let l: layer.Vector = this.routingService.generateRoute(
        new Node(null, this.position.coords.longitude, this.position.coords.latitude),
        new Node(this.activeMarker.id, this.activeMarker.lon, this.activeMarker.lat)
      ).generateLayer();
      this.map.removeLayer(this.routeLayer);
      this.map.addLayer(l);
      this.routeLayer = l;
    }
  }

  // Listener interaction

  public click(event) {
    const feature = this.map.forEachFeatureAtPixel(event.pixel,
      (feature) => { return feature; });
    if (feature) {

    } else {
      // set new Endpoint
      let a = proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326');
      this.osmConnection.getNearestAdressNode(a[0], a[1], 0.001).subscribe((res) => {
        let nearest = null;
        res.forEach(element => {
          if (nearest == null || this.getDistToPoint(nearest, a[0], a[1]) > this.getDistToPoint(element, a[0], a[1])) {
            nearest = element;
          }
        });
        if (this.routeLayer != null) {
          this.map.removeLayer(this.routeLayer);
          this.routeLayer = null;
        }
        this.activeMarker = nearest;
        this.drawMarker(nearest.lon, nearest.lat);
        MapManagementService.infos.changeInfo(this.activeMarker);
      });
      // MapManagementService.setMarker(a[0], a[1]);
    }
  }
}
