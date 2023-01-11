<template>
  <div>
    <v-card>
      <v-card-title>
        Технологик карта
      </v-card-title>
      <v-card-text>
        <search-tech-card/>
      </v-card-text>
    </v-card>
    <v-card>
      <data-table></data-table>
    </v-card>
  </div>
</template>

<script>
import SearchTechCard from "@/pages/tech_cards/components/SearchTechCard";
import DataTable from "@/pages/tech_cards/components/DataTable";
export default {
  name: "TechCardIndex",
  components: {
    SearchTechCard,
    DataTable,
  }
}
</script>

<style scoped>

</style>