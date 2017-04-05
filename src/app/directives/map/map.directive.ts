import { Directive, ElementRef } from '@angular/core';
import { Map, View, Tile, layer, source, control, interaction, geom, proj, format, style, Feature, coordinate } from 'openlayers';
import { MapManagementService } from './../../services/map-management/map-management.service';
import { OsmConnectionService } from './../../services/osm-connection/osm-connection.service';

@Directive({
  selector: '[map]'
})
export class MapDirective {

  map: Map;

  constructor(elementRef: ElementRef, private osmConnection: OsmConnectionService) {
    MapManagementService.osmConnection = osmConnection;
    this.map = MapManagementService.getMapInstance(elementRef);
    this.map.on('click', function (event) {
      MapManagementService.click(event);
    });
  }

}