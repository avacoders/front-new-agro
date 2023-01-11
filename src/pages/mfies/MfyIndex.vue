<template>
  <div>
    <v-card>
      <v-card-title>
        Маҳалла фуқаролар йиғинлари
        <CreateMfy></CreateMfy>
      </v-card-title>
    </v-card>
    <DataTable></DataTable>
  </div>
</template>

<script>
import DataTable from "@/pages/mfies/components/DataTable";
import CreateMfy from "@/pages/mfies/components/CreateMfy";
export default {
  name: "MfyIndex",
  components: {
    DataTable,
    CreateMfy
  },
  mounted() {
    this.$store.commit("setTitle", "Регионы");
  }
}
</script>

<style scoped>

</style>