<template>
  <div>
    <v-card>
      <v-card-title>
        Технологик картадаги агротехник тартиблар муддатларини киритиш
      </v-card-title>
      <search-agronom/>
    </v-card>
    <v-card>
      <data-table/>
    </v-card>
  </div>
</template>

<script>
import SearchAgronom from "@/pages/agronom/components/SearchAgronom";
import DataTable from "@/pages/agronom/components/DataTable";
export default {
  name: "AgronomIndex",
  components: {
    SearchAgronom,
    DataTable
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