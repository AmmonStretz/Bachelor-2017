import { style } from 'openlayers';

export abstract class Constants {

  public static get pointStyle(): style.Style {
    return new style.Style({
      stroke: new style.Stroke({
        color: '#33691e',
        width: 8
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
