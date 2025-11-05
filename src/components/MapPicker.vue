<template>
  <div class="map-picker">
    <div class="map-controls pa-2 d-flex align-center" role="toolbar" aria-label="Map controls">
      <v-btn small text @click="toggleAdding" :aria-pressed="adding">
        <v-icon left>mdi-map-marker-plus</v-icon>
        {{ adding ? 'Add: Click map' : 'Add Marker' }}
      </v-btn>

      <v-btn small text @click="toggleEditable" :aria-pressed="editableLocal">
        <v-icon left>mdi-pencil</v-icon>
        {{ editableLocal ? 'Editing On' : 'Edit Markers' }}
      </v-btn>

      <v-spacer />

      <v-btn icon small @click="fitAll" :aria-label="'Fit map to markers'">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>

    <div ref="mapContainer" class="map-container" :style="{ height }" role="application" aria-label="Map" tabindex="0"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/*
 Props:
   markers: Array (preferred)
   editable: Boolean
   initialCenter: {lat,lng}
   zoom: Number
   height: String

 Emits:
   update:markers, marker-added, marker-selected, coordinates-changed, marker-removed

 Exposed:
   fitAll
*/

const props = defineProps({
  markers: { type: Array, default: () => [] },
  editable: { type: Boolean, default: false },
  initialCenter: { type: Object, default: () => ({ lat: 6.5, lng: 3.4 }) },
  zoom: { type: Number, default: 5 },
  height: { type: String, default: '360px' },
})

const emit = defineEmits(['update:markers','marker-added','marker-selected','coordinates-changed','marker-removed'])

const mapContainer = ref(null)
let map = null
const leafletMarkers = new Map()
const internalMarkers = ref(Array.isArray(props.markers) ? JSON.parse(JSON.stringify(props.markers)) : [])
let idCounter = 1
const adding = ref(false)
const editableLocal = ref(!!props.editable)

function ensureId(m) {
  if (m && m.id) return m.id
  if (!m) m = {}
  m.id = `m_${Date.now().toString(36)}_${idCounter++}`
  return m.id
}

function createIcon(label = '') {
  return L.divIcon({
    className: 'map-marker-divicon',
    html: `<div class="marker-pin" aria-hidden="true"></div><div class="marker-label">${label}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26]
  })
}

function createLeafletMarker(m) {
  ensureId(m)
  const marker = L.marker([m.lat, m.lng], { icon: createIcon(m.label || ''), draggable: !!editableLocal.value })
  marker._meta = { id: m.id, studentId: m.studentId ?? null }

  marker.on('click', () => {
    emit('marker-selected', { marker: serialize(marker) })
  })

  marker.on('dragend', (e) => {
    const p = e.target.getLatLng()
    updateMarkerCoords(marker._meta.id, p.lat, p.lng)
  })

  marker.on('add', () => {
    const el = marker.getElement()
    if (!el) return
    try {
      el.setAttribute('tabindex', '0')
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', `Marker ${marker._meta.id}`)
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault()
          emit('marker-selected', { marker: serialize(marker) })
        }
        if (editableLocal.value && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(ev.key)) {
          ev.preventDefault()
          const step = 0.0005
          const pos = marker.getLatLng()
          if (ev.key === 'ArrowUp') pos.lat += step
          if (ev.key === 'ArrowDown') pos.lat -= step
          if (ev.key === 'ArrowLeft') pos.lng -= step
          if (ev.key === 'ArrowRight') pos.lng += step
          marker.setLatLng(pos)
          updateMarkerCoords(marker._meta.id, pos.lat, pos.lng)
        }
      })
    } catch (err) {
      // ignore DOM errors to avoid breaking the component
      console.warn('Marker DOM event attach failed', err)
    }
  })

  return marker
}

function serialize(leafletMarker) {
  const p = leafletMarker.getLatLng()
  return { id: leafletMarker._meta.id, studentId: leafletMarker._meta.studentId, lat: p.lat, lng: p.lng }
}

function addMarkerToMap(m) {
  ensureId(m)
  if (leafletMarkers.has(m.id)) {
    const lm = leafletMarkers.get(m.id)
    try { lm.setLatLng([m.lat, m.lng]) } catch (_) {}
    return leafletMarkers.get(m.id)
  }
  try {
    const lm = createLeafletMarker(m)
    lm._meta.id = m.id
    lm._meta.studentId = m.studentId ?? null
    lm.addTo(map)
    leafletMarkers.set(m.id, lm)
    return lm
  } catch (err) {
    console.warn('Failed to add marker to map', err)
    return null
  }
}

function removeMarkerFromMap(id) {
  const lm = leafletMarkers.get(id)
  if (!lm) return
  try {
    map.removeLayer(lm)
  } catch (_) {}
  leafletMarkers.delete(id)
  emit('marker-removed', { id })
}

function updateMarkerCoords(id, lat, lng) {
  const idx = internalMarkers.value.findIndex(x => x.id === id)
  if (idx === -1) return
  internalMarkers.value[idx].lat = lat
  internalMarkers.value[idx].lng = lng
  emit('update:markers', JSON.parse(JSON.stringify(internalMarkers.value)))
  emit('coordinates-changed', { marker: { ...internalMarkers.value[idx] } })
}

function fitAll() {
  const arr = Array.from(leafletMarkers.values())
  if (!arr.length) return
  try {
    const grp = L.featureGroup(arr)
    map.fitBounds(grp.getBounds().pad(0.2))
  } catch (err) {
    console.warn('fitAll failed', err)
  }
}

function onMapClick(e) {
  if (!adding.value) return
  const { lat, lng } = e.latlng
  const newM = { id: null, lat, lng, label: '', studentId: null }
  ensureId(newM)
  internalMarkers.value.push(newM)
  addMarkerToMap(newM)
  emit('update:markers', JSON.parse(JSON.stringify(internalMarkers.value)))
  emit('marker-added', { marker: newM })
}

/* -------- watchers (hardened) -------- */
watch(() => props.markers, (val) => {
  try {
    const arr = Array.isArray(val) ? val : []
    internalMarkers.value = JSON.parse(JSON.stringify(arr))

    // reconcile leaflet markers: remove markers not present in incoming set
    const incomingIds = new Set(arr.map(m => m && m.id).filter(Boolean))

    // iterate safely over keys
    for (const k of leafletMarkers.keys()) {
      if (!incomingIds.has(k)) {
        removeMarkerFromMap(k)
      }
    }

    // add/update markers from incoming array
    for (const m of arr) {
      if (m && typeof m === 'object') addMarkerToMap(m)
    }
  } catch (err) {
    console.warn('Error in markers watcher', err)
  }
}, { immediate: true })

watch(internalMarkers, (val) => {
  try {
    if (!Array.isArray(val)) return
    for (const m of val) {
      if (m && typeof m === 'object') addMarkerToMap(m)
    }
  } catch (err) {
    console.warn('Error syncing internalMarkers', err)
  }
}, { deep: true })

watch(() => props.editable, (v) => {
  editableLocal.value = !!v
  for (const lm of leafletMarkers.values()) {
    if (lm && lm.dragging) {
      try { editableLocal.value ? lm.dragging.enable() : lm.dragging.disable() } catch (_) {}
    }
  }
}, { immediate: true })

/* -------- lifecycle -------- */
onMounted(async () => {
  try {
    await nextTick()
    if (!mapContainer.value) {
      console.warn('Map container not found; skipping map initialization')
      return
    }
    map = L.map(mapContainer.value, { center: [props.initialCenter.lat, props.initialCenter.lng], zoom: props.zoom, keyboard: true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)

    // add initial markers (if any)
    if (Array.isArray(props.markers)) {
      for (const m of props.markers) {
        if (m && typeof m === 'object') {
          ensureId(m)
          addMarkerToMap(m)
        }
      }
    }
    map.on('click', onMapClick)
  } catch (err) {
    console.warn('Map init error', err)
  }
})

onBeforeUnmount(() => {
  try {
    if (map) {
      map.off('click', onMapClick)
      map.remove()
      map = null
    }
  } catch (err) {
    console.warn('Map destroy error', err)
  }
})

function toggleAdding() { adding.value = !adding.value }
function toggleEditable() {
  editableLocal.value = !editableLocal.value
  for (const lm of leafletMarkers.values()) {
    if (lm && lm.dragging) {
      try { editableLocal.value ? lm.dragging.enable() : lm.dragging.disable() } catch (_) {}
    }
  }
}
function fitAllHandlers() { fitAll() }

defineExpose({ fitAll: fitAllHandlers })
</script>

<style scoped>
.map-container { width: 100%; border-radius: 8px; overflow: hidden; }
.map-controls { border-bottom: 1px solid rgba(0,0,0,0.06); }
.marker-pin{ width: 16px; height: 16px; border-radius: 8px; background: #1976D2; box-shadow: 0 0 0 2px rgba(0,0,0,0.05); transform: translateY(-6px); }
.marker-label{ font-size: 10px; margin-top: -4px; text-align:center; color:#333; }
</style>
