<template>
  <v-container class="fill-height">
    <v-row class="fill-height elevation-0" id='map'>
    </v-row>
    <v-row class="pl-10">
      <v-btn @click="getDraw">jadon is stupid click me</v-btn>
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

onMounted(() => {
  var map = L.map('map').setView(coor.value, zoom.value);
  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Initialize the FeatureGroup to store editable layers
  map.addLayer(drawnItems.value);

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
  map.addControl(drawControl);
  // Handle the creation of new shapes
  map.on(L.Draw.Event.CREATED, (event: any) => {
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

</script>
