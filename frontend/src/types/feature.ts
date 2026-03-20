export type GeometryType = 'Point' | 'LineString' | 'Polygon'

export interface GeoFeature {
  id: string
  type: GeometryType
  coordinates: number[] | number[][] | number[][][]
  properties: {
    name: string
    description: string
    category: string
  }
  createdBy: string
}
