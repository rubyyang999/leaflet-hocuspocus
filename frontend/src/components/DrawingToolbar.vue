<template>
  <div class="drawing-toolbar">
    <div class="toolbar-left">
      <Button
        :severity="drawMode === 'Point' ? 'primary' : 'secondary'"
        label="Point"
        icon="pi pi-map-marker"
        @click="$emit('setMode', 'Point')"
      />
      <Button
        :severity="drawMode === 'LineString' ? 'primary' : 'secondary'"
        label="Line"
        icon="pi pi-minus"
        @click="$emit('setMode', 'LineString')"
      />
      <Button
        :severity="drawMode === 'Polygon' ? 'primary' : 'secondary'"
        label="Polygon"
        icon="pi pi-stop"
        @click="$emit('setMode', 'Polygon')"
      />
      <Button
        v-if="drawMode"
        severity="danger"
        label="Cancel"
        icon="pi pi-times"
        @click="$emit('setMode', null)"
      />
    </div>
    <span v-if="hint" class="draw-hint">{{ hint }}</span>
    <div class="toolbar-right">
      <span class="user-count">
        <i class="pi pi-users" />
        {{ userCount }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import type { GeometryType } from '../types/feature'

const props = defineProps<{
  drawMode: GeometryType | null
  drawingVertexCount: number
  userCount: number
}>()

defineEmits<{
  setMode: [mode: GeometryType | null]
}>()

const hint = computed(() => {
  if (!props.drawMode) return ''
  if (props.drawMode === 'Point') return 'Click map to place point'
  if (props.drawMode === 'LineString') {
    if (props.drawingVertexCount < 2) return 'Click to add vertices'
    return 'Right-click to finish'
  }
  if (props.drawMode === 'Polygon') {
    if (props.drawingVertexCount < 3) return 'Click to add vertices'
    return 'Click first point to close'
  }
  return ''
})
</script>

<style scoped>
.drawing-toolbar {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  gap: 0.75rem;
}

.toolbar-left {
  display: flex;
  gap: 0.5rem;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.draw-hint {
  font-size: 0.85rem;
  color: #888;
  white-space: nowrap;
}

.user-count {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #666;
}
</style>
