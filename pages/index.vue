<template>
  <div style="height:100%; width:100%" id='map'>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

window.type = ''

var zoom = 13
var coor = [33.448376, -112.074036]

onMounted(async () => {
  var map = L.map('map').setView(coor, zoom);
  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  // Initialize the FeatureGroup to store editable layers
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  // Initialize the draw control and pass it the FeatureGroup of editable layers
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems
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
  map.on(L.Draw.Event.CREATED, (event) => {
    const layer = event.layer;
    drawnItems.addLayer(layer);
  });
})

</script>
