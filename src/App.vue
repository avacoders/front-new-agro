<template>
  <v-app >


    <SideBar></SideBar>
    <AppBar></AppBar>

    <v-main >
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from './components/navigation/SideBar'
import AppBar from './components/AppBar'

export default {
  name: 'App',

  components: {
    SideBar,
    AppBar
  },
  computed: {
    title() {
      return this.$store.getters.title
    }
  },

  data: () => ({
    //
  }),

};
</script>
