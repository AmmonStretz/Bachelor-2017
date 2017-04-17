import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'map-button',
  template: `
  <div class="hover-field"></div>
  <i><ng-content></ng-content></i>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  constructor(public element: ElementRef) {}
}
