<template>
  <div>
    <v-card>
      <v-card-title>
        Районы
        <create-district></create-district>
      </v-card-title>
    </v-card>
    <DataTable></DataTable>
  </div>
</template>

<script>
import DataTable from "@/pages/districts/components/DataTable";
import CreateDistrict from "@/pages/districts/components/CreateDistrict";
export default {
  name: "DistrictIndex",
  components: {
    DataTable,
    CreateDistrict
  },
  mounted() {
    this.$store.commit("setTitle", "Районы");
  }
}
</script>

<style scoped>

</style>