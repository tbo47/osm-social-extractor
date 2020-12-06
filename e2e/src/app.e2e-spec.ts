import { browser } from 'protractor';
import { Poi } from './poi';
import { ProtractorService } from './utils-protractor';

describe('get social media from website', () => {
  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;
  });

  let pois = [{ tags: { website: 'https://www.gaumenkitzel.net/' } }] as Poi[];
  pois = browser.pois;

  pois.forEach(poi => {
    it(`"${poi.tags.name}" ${poi.tags.website}`, async () => {
      const protractorService = new ProtractorService();
      poi = await protractorService.process(poi);
      let buffer = `${poi.id} ; https://www.openstreetmap.org/${poi.type}/${poi.id} ; ${poi.tags.website} ; `;
      poi.betterLinks.forEach(value => buffer = buffer + value + ' ; ');
      protractorService.writeInFile(buffer + '\n');
    });
  });
});
