<template>
  <div id="map" class="fill-height w-100"></div>
</template>

<script setup lang="ts">
// @ts-ignore
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import axios from 'axios';

// @ts-ignore
window.type = 'any';

const zoom = ref(13)
const coor = ref([33.448376, -112.074036])
const drawnItems = ref(new L.FeatureGroup);
const polygon = ref([]);
const map = ref(null);
let res = ref(null)
const mapLayer = ref(new L.FeatureGroup())
const defaultStyle = {
  color: '#3388ff', // Default border color
  weight: 3,
  fillOpacity: 0.2,
};
const highlightStyle = {
  color: '#ff7800', // Highlight border color on hover
  weight: 5,
  fillOpacity: 0.7,
};//

onMounted(() => {
  map.value = L.map('map').setView(coor.value, zoom.value);
  map.value.addLayer(mapLayer.value);
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
      // polygon: false,
      rectangle: false,
      polyline: false,
      circle: false,
      marker: false,
      circlemarker: false,
    }
  });

  map.value.addControl(drawControl);
  // Handle the creation of new shapes
  // https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html
  map.value.on(L.Draw.Event.CREATED, (event: any) => {
    console.log('created')
    console.log(event)
    // console.log(event.layer)
    console.log('event.layer.latlngs', event.layer._latlngs)
    const layer = event.layer;
    drawnItems.value.addLayer(layer);
    polygon.value.push(layer._latlngs)
    getTract()
  });
  map.value.on(L.Draw.Event.DELETED, (event: any) => {
    console.log('deleted')
    console.log(event)
  });
})

async function getDraw() {
  // @ts-ignore
  res.value = await $fetch('/api/censustract', {
    method: 'post',
    body: { test: 123 }
  })
  // console.log('drawnItems', drawnItems)
  // console.log('drawnItems.value', drawnItems.value)
  // console.log('drawnItems.value.leaflet_id', drawnItems.value._leaflet_id)
  let polygon = drawnItems._rawValue._layers
  for (const [key, value] of Object.entries(polygon)) {
    console.log(key, value)
  }
}

// function getMap() {
//   map.value.setView([0, 0], 0);
// }

async function deleteDraw() {
  drawnItems.value.clearLayers();
}

async function getTract() {
  let res = {
    boundary: {
      type: "FeatureCollection",
      features: []
    }
  }
  let features: any[] = []
  let polygons = drawnItems._rawValue._layers
  for (const [key, value] of Object.entries(polygons)) {
    let featureTemplate = {
      type: "Feature", properties: {}, geometry: {
        coordinates: [],
        type: "Polygon"
      }
    }
    let coordinates: any = []
    // @ts-ignore
    value._latlngs.forEach((coors: any) => {
      coors.forEach((coor: any) => {
        console.log(coor.lng, coor.lat)
        coordinates.push([coor.lng, coor.lat])
      })
    })
    coordinates.push(coordinates[0])
    // @ts-ignore
    featureTemplate.geometry.coordinates = [coordinates]
    features.push(featureTemplate)
  }
  // @ts-ignore
  res.boundary.features = features
  let data = await axios.post('http://localhost:8080/tracts/within-boundary', res, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  data.data.forEach((polygon: any) => {
    console.log('polygon', polygon)
    let layer = L.geoJson(polygon.geometry).bindTooltip(function (_) {
      let popUp = `<h3>State: ${polygon.state}</h3><br><h3>Code: ${polygon.censuscode}</h3>`
      return popUp
    })

    layer.on('mouseover', function (e) {
      e.target.setStyle(highlightStyle);
    });
    // Add mouseout event listener that reverts back original/default styling once no longer hovered over.
    layer.on('mouseout', function (e) {
      e.target.setStyle(defaultStyle);
    });
    mapLayer.value.addLayer(layer)
  })
  drawnItems.value.clearLayers()
  console.log('add layer')
}

function resetMap() {
  map.value.setView(coor.value, zoom.value);
}

</script>
