import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Setting } from './../../classes/setting';
@Component({
  selector: 'map-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public static filters = '';
  public static filteredSettings: Setting[] = [];

  public myForm: FormGroup;
  public list: FormArray;
  private settings: Setting[] = Setting.default_settings;

  private test: any;
  private u:any;

  ngOnInit() {
    this.loadCookie();

    this.list = new FormArray([]);
    this.myForm = new FormGroup({
      list: this.list
    });

    this.settings.forEach(s => {
      this.addControl(s);
    });
  }

  private updateRoutingSettings() {
    SettingsComponent.filteredSettings = [];
    SettingsComponent.filters = '';
    this.settings.forEach(s => {
      if (s.use) {
        if (!s.block) {
          SettingsComponent.filteredSettings.push(s);
        } else {
          SettingsComponent.filters += '[' + s.key + '!="' + s.value + '"]';
        }
      }
    });
  }

  private addControl(setting: Setting) {
    const name = 'ctrl_' + this.list.length;
    this.list.push(new FormControl(name));

    this.myForm.addControl(name,
      new FormGroup({
        title: new FormControl(setting.title),
        use: new FormControl(setting.use),
        block: new FormControl(setting.block),
        rating: new FormControl(setting.rating),
        info: new FormControl({ key: setting.key, value: setting.value }),
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
  }

  private loadCookie() {
    const cookies = [];
    document.cookie.split(';').forEach(c => {
      const tmp = c.split('=');
      if (tmp.length === 2) {
        if (tmp[0].charAt(0) === ' ') {
          tmp[0] = tmp[0].substr(1, tmp[0].length - 1);
        }
        cookies[tmp[0]] = tmp[1];
      }
    });
    this.settings.forEach(setting => {
      if (cookies[setting.getRatingKey()]) {
        setting.rating = Number(cookies[setting.getRatingKey()]);
      }
      if (cookies[setting.getUseKey()]) {
        setting.use = cookies[setting.getUseKey()] === 'true';
      }
      if (cookies[setting.getBlockKey()]) {
        setting.block = cookies[setting.getBlockKey()] === 'true';
      }
    });
    this.updateRoutingSettings();
  }

}