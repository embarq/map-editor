<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import * as L from 'leaflet'

const emit = defineEmits(['mapClick', 'markerClick'])
const MAP_CENTER = [48.379433, 31.16558]
const MAP_ZOOM = 6
const GEO_JSON_TILES_COUNT = 16
const geoJsonTilesLoaded = ref(0)
const geoJsonLoaded = computed(() => geoJsonTilesLoaded.value === GEO_JSON_TILES_COUNT)
const mapPinIcon = L.icon({
  iconUrl: '/pin-purple.svg',
  iconSize: [32, 32],
})
const mapTempPinIcon = L.icon({
  iconUrl: '/pin-red.svg',
  iconSize: [32, 32],
})
/** @type {L.Map} */
let appMap = null
/** @type {L.GeoJSON} */
let geoJsonLayer = null
/** @type {L.Marker}*/
let mapTempPin = null
const getGeoJsonLayerStyle = (isShown = false) => ({
  color: '#3b82f6',
  weight: 2,
  opacity: isShown ? 0.6 : 0,
})

const loadGeoJsonData = (geoJsonLayer) => {
  const geoJsonDataFiles = Array.from(
    { length: GEO_JSON_TILES_COUNT },
    (_, i) => `/hotosm_ukr_railways_lines_simplified-quadrant-${i}.json`
  );

  geoJsonDataFiles.forEach((geoJsonDataFile) => {
    fetch(geoJsonDataFile)
      .then((response) => response.json())
      .then((geoJsonData) => {
        geoJsonLayer.addData(geoJsonData);
        geoJsonTilesLoaded.value += 1;
      })
      .catch((error) => {
        console.error(`Error loading ${geoJsonDataFile}`, error);
      });
  });
}

const handleMarkerClick = (e) => {
  e.originalEvent.stopPropagation()
  emit('markerClick', e)
}

const initMap = () => {
  appMap = L.map('map-host').setView(MAP_CENTER, MAP_ZOOM)
  geoJsonLayer = L.geoJSON(null, {
    style: getGeoJsonLayerStyle(false)
  }).addTo(appMap)

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(appMap)

  loadGeoJsonData(geoJsonLayer);

  appMap.on('click', (e) => {
    emit('mapClick', e)
    if (!mapTempPin) {
      mapTempPin = L.marker(e.latlng, { icon: mapTempPinIcon }).addTo(appMap).on('click', handleMarkerClick)
    } else {
      mapTempPin.setLatLng(e.latlng).setOpacity(1)
    }
  })
}

/** @type {() => L.Marker[]} */
const getAllMarkers = () => {
  const markers = []
  appMap.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      markers.push(layer)
    }
  })
  return markers
}

defineExpose({
  addPoint: ({ point, title, id }) => {
    return L.marker(point, { title, id, icon: mapPinIcon }).addTo(appMap).on('click', handleMarkerClick)
  },
  hideTempPin: () => {
    mapTempPin?.setOpacity(0)
  },
  highlightMarker: ({ id }) => {
    getAllMarkers().forEach((marker) => {
      if (marker.options.id !== id) {
        marker.setOpacity(0.3)
      } else {
        marker.setOpacity(1)
      }
    })
  },
  resetHighlight: () => {
    getAllMarkers().forEach((marker) => {
      marker.setOpacity(1)
    })
  },
  zoomInToMarker: ({ id }) => {
    const marker = getAllMarkers().find((marker) => marker.options.id === id)

    if (marker) {
      appMap.setView(marker.getLatLng(), 14)
    }
  },
  updateNetworkSettings: ({ showNetwork }) => {
    geoJsonLayer.setStyle(getGeoJsonLayerStyle(showNetwork))
  },
  updatePoints: (points) => {
    // add or update new markers
    {
      const markers = getAllMarkers()
  
      points.forEach(({ point, title, id }) => {
        const existingMaker = markers.find((marker) => marker.options.id === id);
  
        if (existingMaker) {
          if (!existingMaker.getLatLng().equals(L.GeoJSON.coordsToLatLng(point))) {
            console.log('update marker', existingMaker.getLatLng(), point)
            existingMaker.setLatLng(point)
            return
          }
          return
        }
  
        L.marker(point, { title, id, icon: mapPinIcon }).addTo(appMap).on('click', handleMarkerClick)
      })
    }
    // remove redundant markers
    {
      const markers = getAllMarkers()

      markers.forEach((marker) => {
        if (marker.options.id == null) {
          return
        }

        const existingPoint = points.find((point) => point.id === marker.options.id)

        if (!existingPoint) {
          console.log('remove marker', marker.options.id)
          marker.remove()
        }
      })
    }
  }
})

onMounted(() => {
  initMap()
})
</script>
<template>
  <div id="map-host" class="min-h-screen"></div>
</template>