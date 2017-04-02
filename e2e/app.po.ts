import { browser, element, by } from 'protractor';

export class BikeMapPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('map-root h1')).getText();
  }
}
