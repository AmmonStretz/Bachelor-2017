import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';

export class Node {

  public id: number;
  public lon: number;
  public lat: number;

  constructor(id: number, lon: number, lat: number) {
    this.id = id;
    this.lon = lon;
    this.lat = lat;
  }
}