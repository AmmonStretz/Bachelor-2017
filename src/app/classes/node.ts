import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';
import { Edge } from './edge';

import { Setting } from './setting';

export class Node {

  public id: number;
  public lon: number;
  public lat: number;
  public tags: Object[];
  public edges: Edge[];

  public distance: number = Infinity;
  public predecessor_id: number = null;

  constructor(lon: number, lat: number, id?: number, tags?: Object[]) {
    this.id = id || null;
    this.lon = lon;
    this.lat = lat;
    this.tags = tags || [];
    this.edges = [];
  }

  public getDistToPoint(n1: Node): number {
    return Math.sqrt(
      (this.lon - n1.lon) * (this.lon - n1.lon) +
      (this.lat - n1.lat) * (this.lat - n1.lat)
    );
  }
  public getEdgeWeight(e1: Edge, settings: Setting[]): number {
    let weight = this.getDistToPoint(e1.node);
    settings.forEach(s => {
      if (e1.way.tags[s.key] && e1.way.tags[s.key] === s.value) {
        weight *= s.rating;
      }
    });
    return weight;
  }
  public weighNeighbors(ratings: Setting[]): void{
    this.edges.forEach(edge => {
        const tmpDist: number = this.distance + this.getEdgeWeight(edge, ratings);
        if (edge.node.distance > tmpDist) {
          edge.node.distance = tmpDist;
          edge.node.predecessor_id = this.id;
        }
      });
  }

  public add(n: Node): Node {
    return new Node(this.lon + n.lon, this.lat + n.lat);
  }
  public sub(n: Node): Node {
    return new Node(this.lon - n.lon, this.lat - n.lat);
  }
  public mul(n: number): Node {
    return new Node(this.lon * n, this.lat * n);
  }

   public calcNearestNodeFromList(list: any): Node {
    let nearest: Node = null;
    list.forEach(node => {
      if (node.type === 'node') {
        const tmpNode = new Node(node.lon, node.lat, node.id, node.tags);
        if (nearest == null || this.getDistToPoint(nearest) > this.getDistToPoint(tmpNode)) {
          nearest = tmpNode;
        }
      }
    });
    return nearest;
  }
}