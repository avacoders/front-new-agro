<template>
  <div>
    <v-card>
      <v-card-title>
        Технологик карта
      </v-card-title>
        <search-tech-card/>
    </v-card>
    <v-card>
      <v-tabs
          align-with-title
          v-model="tab"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">

        <v-tab-item :key="items[0]">
          <data-table/>
        </v-tab-item>
        <v-tab-item :key="items[1]">
          <map-dialog ref="mapView" :change="tab" :lands="lands"/>
        </v-tab-item>
      </v-tabs-items>

    </v-card>
  </div>
</template>

<script>
import SearchTechCard from "@/pages/tech_cards/components/SearchTechCard";
import DataTable from "@/pages/tech_cards/components/DataTable";
import MapDialog from "@/pages/tech_cards/components/MapDialog";

export default {
  name: "TechCardIndex",
  components: {
    MapDialog,
    SearchTechCard,
    DataTable,
  },
  data() {
    return {
      tab: null,
      items: ["Жадвал", "Харита"],
    }
  },
  computed: {
    lands: {
      get() {
        return this.$store.getters.gis_bridge_lands;
      },
      set(value) {
        this.$store.commit('gis_bridge_lands', value);
      }
    },
    tech_card() {
      return this.$store.getters.tech_card
    },
  },
}
</script>

<style scoped>

</style>