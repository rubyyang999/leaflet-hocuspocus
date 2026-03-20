import { ref, computed } from 'vue'
import { useYjs } from './useYjs'
import type { GeoFeature, GeometryType } from '../types/feature'
import type { LatLngTuple } from 'leaflet'

export function useDrawing() {
  const { yFeatures, userId } = useYjs()

  const drawMode = ref<GeometryType | null>(null)
  const drawingVertices = ref<LatLngTuple[]>([])
  const pendingFeature = ref<Partial<GeoFeature> | null>(null)
  const showDialog = ref(false)

  // Reactive list of all features from Yjs
  const features = ref<GeoFeature[]>([])

  function syncFeatures() {
    features.value = Array.from(yFeatures.values()) as GeoFeature[]
  }

  // Observe Yjs changes
  yFeatures.observe(() => {
    syncFeatures()
  })
  syncFeatures()

  function setDrawMode(mode: GeometryType | null) {
    drawMode.value = mode
    drawingVertices.value = []
  }

  // Check if two latlngs are close enough to be considered the same point
  function isNearFirstVertex(latlng: LatLngTuple): boolean {
    if (drawingVertices.value.length < 3) return false
    const first = drawingVertices.value[0]
    const threshold = 0.0005 // ~50m at equator
    return (
      Math.abs(latlng[0] - first[0]) < threshold &&
      Math.abs(latlng[1] - first[1]) < threshold
    )
  }

  function finalizeLineOrPolygon() {
    const vertices = drawingVertices.value
    const minVertices = drawMode.value === 'Polygon' ? 3 : 2
    if (vertices.length < minVertices) return

    const coords = vertices.map(
      ([lat, lng]) => [lng, lat] as [number, number]
    )

    if (drawMode.value === 'Polygon') {
      coords.push(coords[0])
      pendingFeature.value = {
        type: 'Polygon',
        coordinates: [coords],
      }
    } else {
      pendingFeature.value = {
        type: 'LineString',
        coordinates: coords,
      }
    }

    showDialog.value = true
    drawingVertices.value = []
  }

  function handleMapClick(latlng: LatLngTuple) {
    if (!drawMode.value) return

    if (drawMode.value === 'Point') {
      pendingFeature.value = {
        type: 'Point',
        coordinates: [latlng[1], latlng[0]], // GeoJSON: [lng, lat]
      }
      showDialog.value = true
      drawMode.value = null
      return
    }

    // Polygon: close by clicking near first vertex
    if (drawMode.value === 'Polygon' && isNearFirstVertex(latlng)) {
      const coords = drawingVertices.value.map(
        ([lat, lng]) => [lng, lat] as [number, number]
      )
      coords.push(coords[0])
      pendingFeature.value = {
        type: 'Polygon',
        coordinates: [coords],
      }
      showDialog.value = true
      drawingVertices.value = []
      return
    }

    // Line or Polygon: accumulate vertices
    drawingVertices.value = [...drawingVertices.value, latlng]
  }

  function handleFinishDraw() {
    if (!drawMode.value || drawMode.value === 'Point') return
    finalizeLineOrPolygon()
  }

  function confirmFeature(name: string, description: string, category: string) {
    if (!pendingFeature.value) return

    const feature: GeoFeature = {
      id: crypto.randomUUID(),
      type: pendingFeature.value.type!,
      coordinates: pendingFeature.value.coordinates!,
      properties: { name, description, category },
      createdBy: userId,
    }

    yFeatures.set(feature.id, feature)
    showDialog.value = false
    pendingFeature.value = null
    drawingVertices.value = []
    drawMode.value = null
  }

  function cancelFeature() {
    showDialog.value = false
    pendingFeature.value = null
    drawingVertices.value = []
    drawMode.value = null
  }

  return {
    drawMode: computed(() => drawMode.value),
    drawingVertices: computed(() => drawingVertices.value),
    features,
    showDialog,
    setDrawMode,
    handleMapClick,
    handleFinishDraw,
    confirmFeature,
    cancelFeature,
  }
}
