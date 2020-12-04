export interface Poi {
    type: string;
    id: number;
    lat: number;
    lng: number;
    osm_url: string;
    tags: { name: string, website: string, amenity: string, opening_hours: string, cuisine: string, phone: string, [x: string]: string };
    betterLinks: Map<string, string>;
}
