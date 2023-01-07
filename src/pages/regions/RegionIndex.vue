<template>
  <div>
    <v-card>
      <v-card-title>
        Регионы
        <CreateRegion></CreateRegion>
      </v-card-title>
    </v-card>
    <DataTable></DataTable>
  </div>
</template>

<script>
import DataTable from "@/pages/regions/components/DataTable";
import CreateRegion from "@/pages/regions/components/CreateRegion";
export default {
  name: "RegionIndex",
  components: {
    DataTable,
    CreateRegion
  },
  mounted() {
    this.$store.commit("setTitle", "Регионы");
  }
}
</script>

<style scoped>

</style>