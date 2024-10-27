<template>
  <v-container class="fill-height fill-width position-relative" fluid>
    <v-autocomplete class="position-absolute top-0 right-0 w-25 pt-10 pr-10" v-model:search="search"
      label="Enter City, State" style="z-index: 10;" bg-color="black" @update:search="onInput" :items="listData"
      @keyup.enter="onEnter" item-title="city" item-value="city" />
    <Map />
  </v-container>
</template>

<script setup lang="ts">
// @ts-ignore
import { debounce } from 'lodash'
import { useMaps } from "../stores/map"

let search = ref("")
let listData = ref([])

let mapStore = useMaps()

const onEnter = () => {
  mapStore.updateCenter([listData.value[0].lat, listData.value[0].lng])
}

const onInput = debounce(async (value: string) => {
  if (value != "") {
    let query = value.replaceAll(',', '').replaceAll(' ', '%20').toLowerCase()
    const { data } = await useFetch(`http://localhost:8080/tracts/search/city/${query}`)
    let newList: string[] = []
    data.value.forEach((res: any) => {
      // @ts-ignore
      newList.push({ city: res.city_ascii + ', ' + res.state_id, lat: res.lat, lng: res.lng })
    })
    listData.value = newList
  }
}, 1000);

</script>
