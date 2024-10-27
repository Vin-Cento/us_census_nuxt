<template>
  <div class="fill-height w-100">
    <div id="map" class="fill-height w-100" style="z-index: 1;"></div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { incomeHash, incomeNumberHash, incomeAverageHash, defaultStyle, highlightStyle } from '../constants/constants'
import { useMaps } from "../stores/map"
import { storeToRefs } from 'pinia'

// @ts-ignore
window.type = 'any';

let mapState = storeToRefs(useMaps())
const zoom = ref(13)
const coor = ref(mapState.center)
const drawnItems = ref(new L.FeatureGroup);
const mapPolygon = ref([]);
const map = ref(null);
const censusLayer = ref(new L.FeatureGroup())

watch(mapState.center, async (newCenter: any[],) => {
  map.value.setView([newCenter[0], newCenter[1]], 10);
})

onMounted(() => {
  map.value = L.map('map').setView(coor.value, zoom.value);
  map.value.addLayer(censusLayer.value);
  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map.value);

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
    // console.log(event.layer)
    const layer = event.layer;
    drawnItems.value.addLayer(layer);
    mapPolygon.value.push(layer._latlngs)
    getTract(censusLayer)
  });
  map.value.on(L.Draw.Event.DELETED, (event: any) => { });
})

async function getTract(censusLayer: any) {
  censusLayer.value.clearLayers()
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
        // console.log(coor.lng, coor.lat)
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
  const { data, error } = await useFetch('http://localhost:8080/tracts/income', {
    method: 'POST',
    // @ts-ignore
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(res)
  });
  data.value.forEach((mapPolygon: any) => {
    let avgIncome: any = mapPolygon.income.B19301_001E
    let avgIncomeHash: string = ''
    if (avgIncome != '$0.00' && avgIncome) {
      let avgIncomeNumber: number = Number(avgIncome.replaceAll(',', '').replaceAll('$', ''))
      if (0 < avgIncomeNumber && avgIncomeNumber <= 100000) {
        avgIncomeNumber = Math.ceil(avgIncomeNumber / 10000) * 10000;
        avgIncomeHash = String(avgIncomeNumber);
      }
      else if (100000 < avgIncomeNumber && avgIncomeNumber <= 125000) {
        avgIncomeHash = String(125000)
      }
      else if (125000 < avgIncomeNumber && avgIncomeNumber <= 150000) {
        avgIncomeHash = String(150000)
      }
      else if (150000 < avgIncomeNumber && avgIncomeNumber <= 200000) {
        avgIncomeHash = String(200000)
      }
      else if (200000 < avgIncomeNumber && avgIncomeNumber <= 250000) {
        avgIncomeHash = String(250000)
      }
      else if (300000 < avgIncomeNumber && avgIncomeNumber <= 400000) {
        avgIncomeHash = String(400000)
      }
      else if (400000 < avgIncomeNumber && avgIncomeNumber <= 500000) {
        avgIncomeHash = String(500000)
      }
      else if (500000 < avgIncomeNumber && avgIncomeNumber <= 600000) {
        avgIncomeHash = String(600000)
      }
      else if (600000 < avgIncomeNumber && avgIncomeNumber <= 700000) {
        avgIncomeHash = String(700000)
      }
      else if (700000 < avgIncomeNumber && avgIncomeNumber <= 1000000) {
        avgIncomeHash = String(1000000)
      }
    } else {
      avgIncomeHash = "NA"
    }

    let layer = L.geoJson(mapPolygon.geometry).bindTooltip(function (_) {
      // @ts-ignore
      let popUp = `<h5>State: ${mapPolygon.state}</h5><br><h5>County: ${mapPolygon.county}</h5><br><h5>Code: ${mapPolygon.censuscode}</h5><br><h5>Income: ${avgIncome}</h5><br><h5>Year: 2021</h5>`
      return popUp
    })
    // @ts-ignore
    layer.setStyle({ ...defaultStyle, ...{ fillColor: incomeAverageHash[String(avgIncomeHash)] } })

    layer.on('mouseover', function (e) {
      e.target.setStyle(highlightStyle);
    });
    // Add mouseout event listener that reverts back original/default styling once no longer hovered over.
    layer.on('mouseout', function (e) {
      e.target.setStyle(defaultStyle);
    });
    censusLayer.value.addLayer(layer)
  })
  drawnItems.value.clearLayers()
}

function resetMap() {
  map.value.setView(coor.value, zoom.value);
}

</script>
