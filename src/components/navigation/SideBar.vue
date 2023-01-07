<template>
    <v-navigation-drawer permanent app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ title}}
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
          dense
          nav
          rounded
      >
        <v-list-item-group
            color="primary"
        >
          <v-list-item
              v-for="item in items"
              :key="item.route"
              link
              :to="{ name: item.route }"
              :item="item"


          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
import navigators from "@/router/navigators";

export default {
  name: 'SideBar',

  data() {
    return {
      items: [],
      right: null,
    }
  },
  computed: {
    title() {
      return this.$store.getters.title
    }
  },
  mounted() {
    this.items = navigators
  }
}
</script>