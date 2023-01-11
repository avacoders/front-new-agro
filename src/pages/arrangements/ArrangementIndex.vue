<template>
  <div>
    <v-card>
      <v-card-title>
        Агротехник тадбирлар рўйхати
        <create-arrangement></create-arrangement>
      </v-card-title>
    </v-card>
    <DataTable></DataTable>
  </div>
</template>

<script>
import DataTable from "@/pages/arrangements/components/DataTable";
import CreateArrangement from "@/pages/arrangements/components/CreateArrangement";
export default {
  name: "ArrangementIndex",
  components: {
    CreateArrangement,
    DataTable
  }
}
</script>

<style scoped>

</style>