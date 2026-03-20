<template>
  <div class="app-container">
    <MapView
      :features="features"
      :draw-mode="drawMode"
      :drawing-vertices="drawingVertices"
      @map-click="handleMapClick"
      @finish-draw="handleFinishDraw"
    />
    <DrawingToolbar
      :draw-mode="drawMode"
      :drawing-vertex-count="drawingVertices.length"
      :user-count="userCount"
      @set-mode="setDrawMode"
    />

    <Dialog
      v-model:visible="showDialog"
      header="Feature Properties"
      :modal="true"
      :style="{ width: '400px' }"
      @hide="onDialogHide"
    >
      <div class="dialog-form">
        <div class="field">
          <label for="feat-name">Name</label>
          <InputText id="feat-name" v-model="formName" fluid />
        </div>
        <div class="field">
          <label for="feat-desc">Description</label>
          <Textarea id="feat-desc" v-model="formDescription" rows="3" fluid />
        </div>
        <div class="field">
          <label for="feat-cat">Category</label>
          <InputText id="feat-cat" v-model="formCategory" fluid />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" severity="secondary" @click="onCancel" />
        <Button label="Save" @click="onSave" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MapView from './components/MapView.vue'
import DrawingToolbar from './components/DrawingToolbar.vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useDrawing } from './composables/useDrawing'
import { useYjs } from './composables/useYjs'

const { userCount } = useYjs()
const {
  drawMode,
  drawingVertices,
  features,
  showDialog,
  setDrawMode,
  handleMapClick,
  handleFinishDraw,
  confirmFeature,
  cancelFeature,
} = useDrawing()

const formName = ref('')
const formDescription = ref('')
const formCategory = ref('')

function onSave() {
  confirmFeature(formName.value, formDescription.value, formCategory.value)
  formName.value = ''
  formDescription.value = ''
  formCategory.value = ''
}

function onCancel() {
  cancelFeature()
  formName.value = ''
  formDescription.value = ''
  formCategory.value = ''
}

function onDialogHide() {
  cancelFeature()
  formName.value = ''
  formDescription.value = ''
  formCategory.value = ''
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app-container {
  width: 100vw;
  height: 100vh;
}

.dialog-form .field {
  margin-bottom: 1rem;
}

.dialog-form .field label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
}
</style>
