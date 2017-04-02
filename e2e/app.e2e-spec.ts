import { BikeMapPage } from './app.po';

describe('bike-map App', function() {
  let page: BikeMapPage;

  beforeEach(() => {
    page = new BikeMapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('map works!');
  });
});
