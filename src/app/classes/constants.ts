import {
  Geolocation, Map, View, Tile, layer,
  source, control, interaction, geom, proj, format, style, Feature, coordinate
} from 'openlayers';

export abstract class Constants {

  public static get pointStyle(): style.Style {
    return new style.Style({
      stroke: new style.Stroke({
        color: 'black',
        width: 4
      }),
      fill: new style.Fill({
        color: 'white'
      })
    });
  }

  public static get locationPointStyle() {
    return new style.Style({
      stroke: new style.Stroke({
        color: 'green',
        width: 30
      }),
      fill: new style.Fill({
        color: 'white'
      })
    });
  }
}
