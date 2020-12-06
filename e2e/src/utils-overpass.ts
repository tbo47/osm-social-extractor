import { Poi } from './poi';

export class OverpassService {
  overpassUrl = 'https://overpass-api.de/api/interpreter';

  async getPOIs() {
    // http://tools.geofabrik.de/calc/
    // const bbox = '37.845138693438756,-122.3001480102539,37.87644551927934,-122.27182388305664';
    const bbox = '37.83,-122.35,37.92,-122.21';
    const q = `
        [out:json][timeout:25];
        (
          node["amenity"="cafe"](${bbox});
          way["amenity"="cafe"](${bbox});
          relation["amenity"="cafe"](${bbox});
          node["amenity"="restaurant"](${bbox});
          way["amenity"="restaurant"](${bbox});
          relation["amenity"="restaurant"](${bbox});
        );
        out body;
        >;
        out skel qt;`;
    const axios = require('axios');
    const response = await axios.post(this.overpassUrl, q);
    const pois = response.data.elements as Poi[];
    pois.forEach(p => p.osm_url = `https://www.openstreetmap.org/${p.type}/${p.id}`);
    const filteredPois = pois.filter(p => p.tags).filter(p => p.tags?.website?.length > 6);
    return filteredPois.slice().sort((a, b) => a.id - b.id);
  }
}
