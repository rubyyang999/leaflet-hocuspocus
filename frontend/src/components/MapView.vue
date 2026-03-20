<template>
  <l-map
    :zoom="13"
    :center="[25.033, 121.565]"
    :use-global-leaflet="false"
    class="map-container"
    @click="onMapClick"
    @contextmenu="onRightClick"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    <template v-for="feature in features" :key="feature.id">
      <l-marker
        v-if="feature.type === 'Point'"
        :lat-lng="[(feature.coordinates as number[])[1], (feature.coordinates as number[])[0]]"
      >
        <l-popup>
          <strong>{{ feature.properties.name }}</strong><br />
          {{ feature.properties.description }}<br />
          <em>{{ feature.properties.category }}</em>
        </l-popup>
      </l-marker>

      <l-polyline
        v-else-if="feature.type === 'LineString'"
        :lat-lngs="toLatLngs(feature.coordinates as number[][])"
        color="blue"
      >
        <l-popup>
          <strong>{{ feature.properties.name }}</strong><br />
          {{ feature.properties.description }}<br />
          <em>{{ feature.properties.category }}</em>
        </l-popup>
      </l-polyline>

      <l-polygon
        v-else-if="feature.type === 'Polygon'"
        :lat-lngs="toLatLngs(feature.coordinates[0] as number[][])"
        color="green"
      >
        <l-popup>
          <strong>{{ feature.properties.name }}</strong><br />
          {{ feature.properties.description }}<br />
          <em>{{ feature.properties.category }}</em>
        </l-popup>
      </l-polygon>
    </template>

    <!-- Drawing preview: in-progress line/polygon vertices -->
    <template v-if="drawMode && drawingVertices.length > 0">
      <l-polyline
        v-if="drawingVertices.length >= 2"
        :lat-lngs="drawingVertices"
        :color="drawMode === 'Polygon' ? 'green' : 'blue'"
        dash-array="5,10"
      />
      <l-circle-marker
        v-for="(vertex, i) in drawingVertices"
        :key="drawMode + '-' + i"
        :lat-lng="vertex"
        :radius="5"
        color="red"
      />
    </template>
  </l-map>
</template>

<script setup lang="ts">
import {
  LMap,
  LTileLayer,
  LMarker,
  LPolyline,
  LPolygon,
  LPopup,
  LCircleMarker,
} from '@vue-leaflet/vue-leaflet'
import type { GeoFeature, GeometryType } from '../types/feature'
import type { LatLngTuple, LeafletMouseEvent } from 'leaflet'

const props = defineProps<{
  features: GeoFeature[]
  drawMode: GeometryType | null
  drawingVertices: LatLngTuple[]
}>()

const emit = defineEmits<{
  mapClick: [latlng: LatLngTuple]
  finishDraw: []
}>()

function toLatLngs(coords: number[][]): LatLngTuple[] {
  return coords.map(([lng, lat]) => [lat, lng] as LatLngTuple)
}

function onMapClick(e: LeafletMouseEvent) {
  if (props.drawMode) {
    emit('mapClick', [e.latlng.lat, e.latlng.lng])
  }
}

function onRightClick(e: LeafletMouseEvent) {
  if (props.drawMode && props.drawMode !== 'Point') {
    e.originalEvent.preventDefault()
    emit('finishDraw')
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
