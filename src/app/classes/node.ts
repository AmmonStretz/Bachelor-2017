import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';

export class Node {

  public id: number;
  public lon: number;
  public lat: number;
  public tags: Object[];

  constructor(id: number, lon: number, lat: number, tags?: Object[]) {
    this.id = id;
    this.lon = lon;
    this.lat = lat;
    this.tags = tags || [];
  }

  public getDistToPoint(n1: Node): number {
    return Math.sqrt(
      (this.lon - n1.lon) * (this.lon - n1.lon) +
      (this.lat - n1.lat) * (this.lat - n1.lat)
    );
  }
}