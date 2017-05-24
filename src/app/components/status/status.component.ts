import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'map-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {

  public static instance: StatusComponent;
  private status: string;
  private icon: string;
  private message: string;

  public static setStatus(icon: string, message: string): void {
    StatusComponent.instance.icon = icon;
    StatusComponent.instance.message = message;
    StatusComponent.instance.status = 'message';

    StatusComponent.instance.show();
  }
  public static setError(message: string){
    StatusComponent.instance.message = message;
    StatusComponent.instance.status = 'error';
    StatusComponent.instance.icon = 'error';
  }

  public static hide() {
    StatusComponent.instance.hide();
  }

  constructor(public el: ElementRef) {
    StatusComponent.instance = this;
    this.status = 'message';
    this.icon = '';
    this.message = '';
  }

  show() {
    this.el.nativeElement.style.display = 'block';
  }
  hide() {
    this.el.nativeElement.style.display = 'none';
  }

  clickFunction() {
    this.hide();
  }

}