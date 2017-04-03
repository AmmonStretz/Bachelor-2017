import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'button[map-button]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() icon: string;

  constructor() {
  }

  ngOnInit() {
  }

}