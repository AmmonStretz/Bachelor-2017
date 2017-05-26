import { Component } from '@angular/core';

@Component({
  selector: '[map-navigation]',
  template: `
    <i (click)="toggle()">{{icon}}</i>
    <h2>{{title}}</h2>`,
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  public settingsVisible = false;
  private icon = 'settings';
  private title = 'BikeMap';

  private toggle(): void {
    if (this.settingsVisible) {
      this.icon = 'settings';
      this.title = 'BikeMap';
    } else {
      this.icon = 'arrow_back';
      this.title = 'Einstellungen';
    }
    this.settingsVisible = !this.settingsVisible;
  }
}
