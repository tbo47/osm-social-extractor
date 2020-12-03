import { Util } from './utils';

describe('get social media from websites', () => {

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;
  });

  let URLS = ['https://www.tortellinosf.com/'];
  URLS = ['https://www.homemade-cafe.com/'];
  URLS = ['https://www.culturedpickleshop.com/', 'https://www.tortellinosf.com/'];
  URLS = ['https://www.mountainmikespizza.com/locations/berkeley-san-pablo/'];

  URLS.forEach(url => {
    it(url, async () => {
      const util = new Util();
      const links = await util.process(url);
      links?.forEach((value, key) => console.log(value));
      expect(links?.size).toBeGreaterThan(0);
    });
  });

});
