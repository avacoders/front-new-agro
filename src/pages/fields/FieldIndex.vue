<template>
  <div>
    <v-card>
      <v-card-title>
        Далалар
        <create-district></create-district>
      </v-card-title>
    </v-card>
    <DataTable></DataTable>
  </div>
</template>

<script>
import DataTable from "@/pages/fields/components/DataTable";
import CreateDistrict from "@/pages/fields/components/CreateDistrict";
export default {
  name: "FieldIndex",
  components: {
    DataTable,
    CreateDistrict
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>