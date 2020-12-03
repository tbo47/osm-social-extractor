
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Poi } from './poi';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    overpassUrl = 'https://overpass-api.de/api/interpreter';

    constructor(private http: HttpClient) { }

    getPOIs() {
        const bbox = '37.845138693438756,-122.3001480102539,37.87644551927934,-122.27182388305664';
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
        return this.http.post(this.overpassUrl, q).pipe(
            map(response => {
                const pois = (response as any).elements as Poi[];
                pois.forEach(p => p.osm_url = `https://www.openstreetmap.org/${p.type}/${p.id}`);
                return pois.filter(p => p.tags);
            })
        );
    }
}
