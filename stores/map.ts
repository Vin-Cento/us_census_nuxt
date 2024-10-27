import { defineStore } from 'pinia'

export const useMaps = defineStore('maps', {
  state: () => ({
    center: [32.363724, -90.891266],
  }),
  getters: {
  },
  actions: {
    // any amount of arguments, return a promise or not
    updateCenter(coor: number[]) {
      // you can directly mutate the state
      this.center = coor
    },
  },
})
