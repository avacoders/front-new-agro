<template>
  <div>
    <v-card>
      <v-card-title>
        Технологик карта
      </v-card-title>
      <search-tech-card/>
    </v-card>

    <v-card>
      <template v-if="lands.length && tech_card.phases && !tech_card.phases.length">
        <map-dialog ref="mapView" :change="tab" :lands="lands"/>
      </template>

      <template v-if="lands.length && tech_card.phases && tech_card.phases.length">
        <v-card class="mt-4">
          <v-card-text>
            <v-row>
              <template v-for="(parameterTable, i) in tech_card.parameters">
                <v-col v-bind:key="i" v-if="Object.keys(params).includes(Object.keys(parameterTable)[0])">
                  {{ params[Object.keys(parameterTable)[0]] }}
                  <v-simple-table>
                    <tbody>
                    <template v-for="(parameter, index) in parameterTable[Object.keys(parameterTable)[0]]">

                      <tr v-bind:key="`${index}_param_${Object.keys(parameterTable)[0]}`"
                          v-if="index != 'id'">
                        <td>{{ params[index] }}</td>
                        <td>{{ parameter  }}</td>
                      </tr>
                    </template>
                    </tbody>
                  </v-simple-table>
                </v-col>
              </template>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card class="mt-4">
          <v-card-title>Жадвал</v-card-title>
          <data-table/>
        </v-card>
      </template>
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
      params: {
        tuzatish: "Тузатиш",
        kul_kuchida_ish: "Қўл кучи (мотоблок ёки моторли асбоб ишлатилганда) иш унумига тузатиш коэффициенти",
        mehaniz_ish: "Механизация иш унумига тузатиш коэффициенти (ер ҳайдашдан бошқа ишларда)",
        // tamirlash: "Тамирлаш",
        // energetic: "Энергетика",
        // kxm: "КХМ",
        // amortizaciya: "Амортизация",
      }
    }
  },
  mounted() {
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