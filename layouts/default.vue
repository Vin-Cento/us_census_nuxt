<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-app-bar-title class="title">
        <NuxtLink to="/">
          {{ title }}
        </NuxtLink>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <div class="d-flex justify-end">
        <v-sheet class="pa-2" v-for="route in routes" :key="route.path">
          <NuxtLink class='pagelinks' v-if="route.name != 'index'" :to="route.path">{{
            route.name.charAt(0).toUpperCase() +
            route.name.slice(1) }}</NuxtLink>
        </v-sheet>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const title = config.public.title
const router = useRouter()
// @ts-ignore
const routes = router.getRoutes().filter(route => {
  return route.meta && route.meta.showInNav !== false
})
</script>

<style>
body {
  font-family: "Helvetica";
}

.pagelinks.router-link-active {
  font-family: "Helvetica Bold";
  color: green;
}

.title {
  font-family: "Helvetica Bold Rounded";
}

a {
  text-decoration: none;
  /* color: cyan; */
}
</style>
