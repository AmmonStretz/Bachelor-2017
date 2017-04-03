import { Component, Input, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'button[map-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, AfterViewInit {
  @Input() icon: string;
  constructor() {
  }

  ngOnInit() {
    console.log(this.icon);
  }

  ngAfterViewInit(){
    // console.log(this.galleryContainer);
  }
}