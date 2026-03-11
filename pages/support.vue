<script lang="ts"></script>
<template>
  <client-only>
    <NavBar/>
    <div id="vrMain" class="vr-main"></div>
    <Cookies />
    <Copyright />
  </client-only>
</template>

<script setup lang="ts">
//import { useSeoMeta, useHead } from '@vueuse/head';
const title = "Vera | Home";
const description = "Truth Serum";
useSeoMeta({
 title: () => title,
 description: () => description,
 charset: "utf-8",
 viewport: "width=device-width, initial-scale=1.0"
});

useHead({
 link: [
 {rel: 'icon', type: 'image/png', href: '/logo.png'},
 {rel: 'stylesheet', href: '/reset.css'},
 {rel: 'stylesheet', href: '/custom.css'} ,
 {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
 {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
 {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+Display:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poiret+One&display=swap'}
 ]
});
</script>
<style scoped></style>
<style></style>