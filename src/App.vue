<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
// No need for logic here, <router-view> handles dynamic route components
</script>

<style>
/* Optional global styles if needed */
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f9f9f9;
}
</style>