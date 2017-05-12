import { style } from 'openlayers';

export abstract class Constants {

  public static get pointStyle(): style.Style {
    return new style.Style({
      stroke: new style.Stroke({
        color: 'black',
        width: 5
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
