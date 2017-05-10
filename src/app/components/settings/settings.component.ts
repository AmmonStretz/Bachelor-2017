import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RoutingService } from '../../services/routing/routing.service';

@Component({
  selector: 'map-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public myForm: FormGroup;
  public list: FormArray;
  private structure = [{
    title: 'Fußgängerwege',
    key: 'highway',
    value: 'footway',
    use: false,
    block: false,
    rating: 0.0
  }, {
    title: 'Pflasterstein',
    key: 'surface',
    value: 'cobblestone',
    use: true,
    block: false,
    rating: 1.0
  }, {
    title: 'Treppen',
    key: 'highway',
    value: 'steps',
    use: true,
    block: true,
    rating: 1.0
  }];

  ngOnInit() {

    this.loadCookie();

    this.list = new FormArray([]);
    this.myForm = new FormGroup({
      list: this.list
    });

    this.structure.forEach(s => {
      this.addControl(s.title, s.use, s.block, s.rating, s.key, s.value);
    });

    this.updateRoutingSettings();
  }

  private updateRoutingSettings() {
    RoutingService.ratings = [];
    RoutingService.filters = '';
    this.structure.forEach(s => {
      if (s.use) {
        if (!s.block) {
          RoutingService.ratings.push(s);
        } else {
          RoutingService.filters += '[' + s.key + '!="' + s.value + '"]';
        }
      }
    });
    // console.log('RoutingService.ratings');
    // console.log(RoutingService.ratings);
  }

  private addControl(
    title: string, use: boolean, block: boolean,
    rating: number, key: string, value: string
  ) {
    const name = 'ctrl_' + this.list.length;
    this.list.push(new FormControl(name));

    this.myForm.addControl(name,
      new FormGroup({
        label: new FormControl(title),
        use: new FormControl(use),
        block: new FormControl(block),
        rating: new FormControl(rating),
        info: new FormControl({ key: key, value: value }),
      }));
  }

  private saveSettings() {
    this.myForm.controls['list'].value.forEach(name => {
      const key = this.myForm.controls[name].value.info.key;
      const value = this.myForm.controls[name].value.info.value;
      document.cookie = key + '_' + value + '_use=' +
        this.myForm.controls[name].value.use + ';';

      document.cookie = key + '_' + value + '_block=' +
        this.myForm.controls[name].value.block + ';';

      document.cookie = key + '_' + value + '_rating=' +
        this.myForm.controls[name].value.rating + ';';
    });
    this.loadCookie();
    // console.log(this.structure);
    // this.updateRoutingSettings();
  }

  private loadCookie() {
    const map = [];
    //read old Cookies
    document.cookie.split(';').forEach(c => {
      const tmp = c.split('=');
      if (tmp.length === 2) {
        if (tmp[0].charAt(0) === ' ') {
          tmp[0] = tmp[0].substr(1, tmp[0].length - 1);
        }
        map[tmp[0]] = tmp[1];
      }
    });
    // overwride structure with old Cookies
    this.structure.forEach(str => {
      const kv = str.key + '_' + str.value;
      if (map[kv + '_rating']) {
        str.rating = Number(map[kv + '_rating']);
      }
      if (map[kv + '_use']) {
        if (map[kv + '_use'] === 'true') {
          str.use = true;
        } else {
          str.use = false;
        }
      }
      if (map[kv + '_block']) {
        if (map[kv + '_block'] === 'true') {
          str.block = true;
        } else {
          str.block = false;
        }
      }
    });
    this.updateRoutingSettings();
  }

}