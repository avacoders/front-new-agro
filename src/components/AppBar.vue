<template>
  <v-app-bar
      app
  >
    <v-app-bar-nav-icon @click="changeDrawer()"></v-app-bar-nav-icon>
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
  data(){
    return {
    }
  },

  methods: {
    onClick() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    changeDrawer(){
      var val = this.$parent.$parent.$refs.sideBar.$data.temporary
      this.$parent.$parent.$refs.sideBar.$data.temporary = !val
      console.log(val);
    }
  },
  computed: {
    theme() {
      return this.$vuetify.theme.dark ? 'dark' : 'light'
    },
  },
  watch: {
  },
}
</script>

<style scoped>

</style>