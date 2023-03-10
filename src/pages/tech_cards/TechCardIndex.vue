<template>
  <div>
    <v-card>
      <v-card-title>
        Технологик карта
      </v-card-title>
      <search-tech-card/>
    </v-card>

    <v-card style="border-radius: 12px">
<!--      <v-overlay-->
<!--          :opacity="1"-->
<!--          :value="loading"-->
<!--      >-->
<!--        <v-progress-circular indeterminate size="64">-->
<!--          Loading...-->
<!--        </v-progress-circular>-->
<!--      </v-overlay>-->
      <template v-if="lands.length && tech_card.phases && !tech_card.phases.length">
        <map-dialog ref="mapView" :change="tab" :lands="lands" />
      </template>
      <v-tabs
          v-model="tab"
          class="my-2"
      >
        <v-tab value="one">Контур Тех.картаси</v-tab>
        <v-tab value="two">Шаблон</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" v-if="lands.length && tech_card.phases && tech_card.phases.length">
        <v-tab-item
            v-for="item in items"
            :key="item"
        >
          <v-card>
            <template v-if="lands.length && tech_card.phases && tech_card.phases.length">
              <v-card class="mt-4">
                <v-card-text>
                  <v-row>
                    <template  v-for="(item, i) in tables">
                      <v-col v-bind:key="i">
                        <v-simple-table>
                          <tbody>
                          <template v-for="(parameter, index) in item.params">

                            <tr v-bind:key="`${index}_param`">
                              <td>{{ parameter.label }}</td>
                              <td>{{ parameter.value  }}</td>
                            </tr>
                          </template>
                          </tbody>
                        </v-simple-table>
                      </v-col>
                    </template>
<!--                    <template v-for="(parameterTable, i) in tech_card.parameters">-->
<!--                      <v-col v-bind:key="i" v-if="Object.keys(params).includes(Object.keys(parameterTable)[0])">-->
<!--                        {{ params[Object.keys(parameterTable)[0]] }}-->
<!--                        <v-simple-table>-->
<!--                          <tbody>-->
<!--                          <template v-for="(parameter, index) in parameterTable[Object.keys(parameterTable)[0]]">-->

<!--                            <tr v-bind:key="`${index}_param_${Object.keys(parameterTable)[0]}`"-->
<!--                                v-if="index != 'id'">-->
<!--                              <td>{{ params[index] }}</td>-->
<!--                              <td>{{ parameter  }}</td>-->
<!--                            </tr>-->
<!--                          </template>-->
<!--                          </tbody>-->
<!--                        </v-simple-table>-->
<!--                      </v-col>-->
<!--                    </template>-->
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card class="mt-4">

                <v-card-title>Жадвал</v-card-title>
                <data-table/>
              </v-card>
            </template>
          </v-card>
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
      tables: [{
        name: "Тузатиш (дала паспорти бўйича) коэффициенти",
        params: [
          {
            label: "Механизация иш унумига тузатиш коэффициенти (ер ҳайдашдан бошқа ишларда)",
            value: 0.753296
          },
          {
            label: "Механизация иш унумига тузатиш коэффициенти (ер ҳайдашда)",
            value: 0.745108
          },
          {
            label: "Ёнилғи сарфига тузатиш коэффициенти (ғилдиракли трактор бўлса)",
            value: 1.1128
          },
          {
            label: "Ёнилғи сарфига тузатиш коэффициенти (занжирли трактор бўлса)",
            value: 1.144
          },
          {
            label: "Қўл кучи (мотоблок ёки моторли асбоб ишлатилганда) иш унумига тузатиш коэффициенти",
            value: 1
          },
        ]
      }, {
        name: "Тупроқ-иқлим шароити",
        params: [
          {
            label: "Минтақа",
            value: "I"
          },
          {
            label: "Дала релъефи қиялиги, %",
            value: 2
          },
          {
            label: "Сув таъминоти - ",
            value: 1.1128
          },
          {
            label: "Шўрланганлиги",
            value: "шўрланмаган"
          },
          {
            label: "Тупроқ тури",
            value: "Бўз тупроқ"
          },
          {
            label: "Тупроқ тури",
            value: "Бўз тупроқ"
          },
          {
            label: "Тупроқ қаршилиги, кПа",
            value: "50-60 кПа"
          },
        ]
      }],
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
    loading(){
      return this.$store.getters.gis_bridge_lands_loading
    },
    tech_card() {
      return this.$store.getters.tech_card
    },
  },
}
</script>

<style scoped>

</style>