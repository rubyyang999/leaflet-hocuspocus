import { ref } from 'vue'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'
import type { GeoFeature } from '../types/feature'

const doc = new Y.Doc()

let provider: HocuspocusProvider | null = null
const userCount = ref(0)
const userId = crypto.randomUUID().slice(0, 8)
const yFeatures = doc.getMap<GeoFeature>('features')

function getWsUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws`
}

export function useYjs() {
  if (!provider) {
    provider = new HocuspocusProvider({
      url: getWsUrl(),
      name: 'leaflet-webgis',
      document: doc,
      onAwarenessChange: ({ states }) => {
        userCount.value = states.length
      },
    })
  }

  return {
    doc,
    yFeatures,
    provider,
    userCount,
    userId,
  }
}
