<script setup>
/**
* @typedef {{id?: string;point: [number, number];title: string;}} MarkerPoint
*/

import { onMounted, ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import { uniqBy } from 'lodash'
import Map from './Map.vue'
import MapNetworkSettingsToolbar from './MapNetworkSettingsToolbar.vue'
import MarkerEditorToolbar from './MarkerEditorToolbar.vue'
import MarkersList from './MarkersList.vue'
import Modal from './Modal.vue'
import PointEditor from './PointEditor.vue'
import Popover from './Popover.vue';

const showEditorModal = ref(false)
const mapComponent = ref(null)
/** @type {import('vue').Ref<MarkerPoint>} */
const activePointMarker = ref(null)
/** @type {import('vue').Ref<MarkerPoint[]>} */
const points = ref([])
const isUpsertActivePoint = ref(false)

const handleEditorModalClose = () => {
  showEditorModal.value = false
}

const handleAddPoint = () => {
  showEditorModal.value = true
}

const handleAddPointFromMap = () => {
  showEditorModal.value = true
  isUpsertActivePoint.value = true
}

const handleEditPoint = () => {
  showEditorModal.value = true
  isUpsertActivePoint.value = true
}

const handleMapClick = (e) => {
  console.log('handleMapClick', e)
}

const handleEditPointFromList = (point) => {
  activePointMarker.value = point
  // isUpsertActivePoint.value = true
  showEditorModal.value = true
}

const handlePointerEditorSubmit = (e) => {
  const { title, lng, lat, id } = e
  /** @type {MarkerPoint} */
  const instance = {
    point: [lat, lng],
    title,
    id: id ?? nanoid()
  }

  // mapComponent.value.addPoint(instance)
  points.value = uniqBy([instance, ...points.value], 'id')
  showEditorModal.value = false

  if (isUpsertActivePoint.value) {
    activePointMarker.value = null
    isUpsertActivePoint.value = false
    mapComponent.value.hideTempPin()
  }
}

const handleMarkerClick = (e) => {
  console.log('[handleMarkerClick]', e)
  
  if (e.target.options.id != null) {
    mapComponent.value.hideTempPin()
  }

  const { id, title } = e.target.options

  activePointMarker.value = {
    id,
    title,
    point: [e.latlng.lat, e.latlng.lng],
  }
}

const handleDelete = ({ id }) => {
  points.value = points.value.filter((point) => point.id !== id)
}

const handleHighlight = (point) => {
  mapComponent.value.highlightMarker(point)
}

const handleResetHighlight = () => {
  mapComponent.value.resetHighlight()
}

const handleZoomInToMarker = (point) => {
  mapComponent.value.zoomInToMarker(point)
}

const pointsToGeoJson = (points) => {
  return {
    type: 'FeatureCollection',
    features: points.map((point) => ({
      type: 'Feature',
      properties: {
        name: point.title,
        id: point.id,
      },
      geometry: {
        type: 'Point',
        coordinates: point.point,
      },
    })),
  }
}

const download = () => {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(
      pointsToGeoJson(points.value)
    )
  )}`
  const downloadAnchorNode = document.createElement('a')
  downloadAnchorNode.setAttribute('href', dataStr)
  downloadAnchorNode.setAttribute('download', 'points.json')
  document.body.appendChild(downloadAnchorNode) // required for firefox
  downloadAnchorNode.click()
  downloadAnchorNode.remove()
}

onMounted(() => {
  watch(points, (_points) => {
    if (mapComponent.value != null) {
      mapComponent.value.updatePoints(_points)
    }
  })

  points.value = [
    {
      point: [50.064191736659104, 30.875135434664998],
      title: 'Test A',
      id: nanoid(),
    },
    {
      title: 'Test B',
      id: nanoid(),
      point: [48.531157010976735, 32.391959396598025],
    },
    {
      title: 'Test C',
      id: nanoid(),
      point: [50.17689812200107, 32.743686692118686],
    },
  ]
  
})

</script>

<template>
  <div class="relative">
    <div class="grid grid-cols-12 dark:bg-zinc-800">
      <div class="z-0 min-h-screen col-span-8 xl:col-span-9">
        <Map
          ref="mapComponent"
          @mapClick="handleMapClick"
          @markerClick="handleMarkerClick" />
      </div>
      <section class="relative z-10 max-h-screen col-span-4 p-5 pt-0 overflow-auto border-l-2 border-gray-200 bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 xl:col-span-3">
        <header class="sticky top-0 z-10 flex items-center justify-between py-5 border-b bg-inherit border-inherit">
          <h1 class="text-3xl font-bold">Map Editor</h1>
          <div class="flex items-center space-x-2">
            <button
              type="button"
              class="px-4 py-2 text-sm font-bold text-center uppercase bg-indigo-700 rounded-lg text-slate-50"
              @click="handleAddPoint">
              add point
            </button>
            <button
              type="button"
              class="px-2 py-2 text-sm rounded-lg text-slate-50 hover:bg-slate-200 dark:hover:text-zinc-900"
              @click="download">
              <i class="gg-calendar-due"></i>
            </button>
          </div>
        </header>
        <MarkersList
          class="mt-1"
          :data="points"
          @edit="handleEditPointFromList"
          @highlight="handleHighlight"
          @mouseleave="handleResetHighlight"
          @zoomInToMarker="handleZoomInToMarker"
          @delete="handleDelete" />
      </section>
    </div>
    <Modal title="Edit point" :isOpen="showEditorModal" @close="handleEditorModalClose">
      <section class="pt-4">
        <PointEditor
          :data="activePointMarker"
          @submit="handlePointerEditorSubmit"
          @delete="handleDelete" />
      </section>
    </Modal>
    <Popover class="fixed top-0 z-10 w-full max-w-sm px-4 -translate-x-1/2 left-1/3">
      <MarkerEditorToolbar 
        v-if="activePointMarker != null"
        :isEdit="activePointMarker.id != null"
        :title="activePointMarker.title"
        @close="activePointMarker = null"
        @edit="handleEditPoint"
        @add="handleAddPointFromMap"
        @highlight="handleZoomInToMarker(activePointMarker)" />
    </Popover>
    <Popover class="fixed z-10 w-full max-w-sm px-4 -translate-x-1/2 bottom-32 left-1/3" v-if="false">
      <MapNetworkSettingsToolbar />
    </Popover>
  </div>
</template>

<style scoped></style>
