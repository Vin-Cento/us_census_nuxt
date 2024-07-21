<template>
  <v-container class="fill-height">
    <v-row class="fill-height elevation-0" id='map'>
    </v-row>
    <v-row class="pl-10">
      <v-btn @click="getDraw">get polygon</v-btn>
      <v-btn @click="resetMap">reset map</v-btn>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// @ts-ignore
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

// @ts-ignore
window.type = ''

const zoom = ref(13)
const coor = ref([33.448376, -112.074036])
const drawnItems = ref(new L.FeatureGroup);
const polygon = ref([]);
const map = ref(null);

onMounted(() => {
  map.value = L.map('map').setView(coor.value, zoom.value);
  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);

  // Initialize the FeatureGroup to store editable layers
  map.value.addLayer(drawnItems.value);

  // Initialize the draw control and pass it the FeatureGroup of editable layers
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems.value
    },
    draw: {
      polygon: true,
      polyline: true,
      rectangle: true,
      circle: true,
      marker: false,
      circlemarker: false,
    }
  });
  map.value.addControl(drawControl);
  // Handle the creation of new shapes
  map.value.on(L.Draw.Event.CREATED, (event: any) => {
    console.log(event.layer)
    console.log('event.layer.latlngs', event.layer._latlngs)
    const layer = event.layer;
    drawnItems.value.addLayer(layer);
    polygon.value.push(layer._latlngs)
  });
})

function getDraw() {
  let polygon = drawnItems._rawValue._layers
  for (const [key, value] of Object.entries(polygon)) {
    console.log(key, value)
  }
}

function getMap() {
  map.value.setView([0, 0], 0);
}

function resetMap() {
  map.value.setView(coor.value, zoom.value);
}

</script>
