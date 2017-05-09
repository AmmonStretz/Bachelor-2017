import {
  layer, source, geom, proj, style, Feature
} from 'openlayers';
import { Node } from './node';
import { Constants } from './constants';

export class Route {

  public routeNodes: Node[] = [];

  public addNode(node: Node) {
    this.routeNodes.push(node);
  }

  public generateLayer(): layer.Vector {
    const coords = [];
    this.routeNodes.forEach(node => {
      coords.push(proj.fromLonLat([node.lon, node.lat]));
    });
    return new layer.Vector({
      source: new source.Vector({
        features: [
          new Feature({
            geometry: new geom.LineString(coords)
          })]
      }), style: Constants.pointStyle
    });
  }
}