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