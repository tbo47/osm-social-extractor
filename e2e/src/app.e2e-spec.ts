import { from } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { OverpassService } from './utils-overpass';
import { ProtractorService } from './utils-protractor';

describe('get social media from websites', () => {

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL * 10;
  });

  let URLS = ['https://www.tortellinosf.com/'];
  URLS = ['https://www.mountainmikespizza.com/locations/berkeley-san-pablo/'];

  it('testing', async () => {
    const overpassService = new OverpassService();
    const pois = await overpassService.getPOIs();
    const protractorService = new ProtractorService();

    await from(pois).pipe(
      concatMap(poi => from(protractorService.process(poi))),
      map(poi => {
        let buffer = `${poi.id} ; https://www.openstreetmap.org/${poi.type}/${poi.id} ; ${poi.tags.website} ; `;
        poi.betterLinks.forEach(value => buffer = buffer + value + ' ; ');
        writeInFile(buffer + '\n');
      })
    ).toPromise();
  });
});

function writeInFile(buffer: string) {
  const fs = require('fs');
  const logger = fs.createWriteStream('log.txt', { flags: 'a' });
  logger.write(buffer);
  logger.end();
}

