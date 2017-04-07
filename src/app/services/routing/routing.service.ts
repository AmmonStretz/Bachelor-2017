import { Injectable } from '@angular/core';
import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, Coordinate
} from 'openlayers';
import { OsmConnectionService } from './../../services/osm-connection/osm-connection.service';

import { Route } from './../../classes/route';
import { Node } from './../../classes/node';
import { Constants } from './../../classes/constants';
@Injectable()
export class RoutingService {

  public static generateRoute(start: Node, goal: Node): Route {
    let r: Route = new Route();
    r.addNode(start);
    r.addNode(goal);
    return r;
  }

}