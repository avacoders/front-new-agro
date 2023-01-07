<template>
  <v-app-bar
      app
  >
    <v-btn
        @click="onClick"
        fab
        small
        icon
        class="ml-auto"
    >
      <v-icon>{{ theme === 'light' ?  'mdi-weather-sunny' : 'mdi-weather-night'}}</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>

export default {
  name: "AppBar",

  methods: {
    onClick() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    }
  }
}
</script>

<style scoped>

</style>