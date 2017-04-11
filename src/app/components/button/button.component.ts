import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'button[map-button]',
  template: `
  <div class="hover-field"></div>
  <i>
    <ng-content></ng-content>
  </i>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, AfterViewInit {
  // @Input() icon: string;
  constructor(public element: ElementRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log(this.galleryContainer);
  }
}