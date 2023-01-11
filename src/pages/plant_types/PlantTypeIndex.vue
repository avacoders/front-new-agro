<template>
  <div>
    <v-card>
      <v-card-title>
        Экин турлари
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
  name: "PlantTypeIndex",
  components: {
    DataTable,
    CreateRegion
  }
}
</script>

<style scoped>

</style>