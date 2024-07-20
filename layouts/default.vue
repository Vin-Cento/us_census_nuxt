<template>
  <v-app>
    <v-app-bar :elevation="2">
      <v-app-bar-title class="title">
        <NuxtLink class="title" to="/">
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
      <slot />
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
  color: #8cc85f;
}

a {
  text-decoration: none;
  color: #80a0ff;
}

.title {
  color: white;
  font-family: "Helvetica Bold Rounded";
}
</style>
