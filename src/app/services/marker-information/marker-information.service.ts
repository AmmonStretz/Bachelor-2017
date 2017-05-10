import { Injectable } from '@angular/core';

import { InformationFieldComponent } from './../../components/information-field/information-field.component'


@Injectable()
export class MarkerInformationService {

public static infos: InformationFieldComponent;

constructor() { }

public static registerInformationField(infos: InformationFieldComponent) {
    this.infos = infos;
  }

}