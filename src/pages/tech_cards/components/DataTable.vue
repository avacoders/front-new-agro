<template>
  <v-card class="mt-4" v-if="tech_card.length">
    <v-card-title>
      <v-row>
        <v-col>
          <b>Ер майдони:</b>
          {{ land.properties.gis_area }} га
        </v-col>
      </v-row>
    </v-card-title>
    <v-simple-table>
      <template v-slot:default>
        <thead>
        <tr>
          <th v-for="header in headers" v-bind:key="header.value" :style="showBorder()">
            {{ header.text }}
          </th>
        </tr>
        </thead>
        <tbody>
        <template v-for="phase in tech_card">
          <tr v-bind:key="phase.id">
            <th colspan="21" :style="showBorder()">{{ phase.name }}</th>
          </tr>
          <template v-for="arrangement in phase.arrangements">
            <tr v-bind:key="`${phase.id}_${arrangement.id}`">
              <template v-for="header in headers">
                <td v-bind:key="`${header.value}_${arrangement.id}`" :style="showBorder()">
                  {{ arrangement[header.value] }}
                  <template v-if="['result', 'tractor_norma'].includes(header.value)">
                    {{ arrangement.unit }}
                  </template>
                </td>
              </template>
            </tr>
          </template>
          <tr v-bind:key="`${phase.id}_all`">
            <th colspan="14" :style="showBorder()">{{ phase.name }}</th>
            <th :style="showBorder()">{{ phase.phase_overall.days_of_shift }}</th>
            <th :style="showBorder()">{{ phase.phase_overall.days_of_shift_human }}</th>
          </tr>
        </template>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>

</template>

<script>

export default {
  name: "DataTable",
  data() {
    return {
      deletingItem: {},
      editingItem: {
        name_uz: "",
        name_ru: "",
        region_code: 0,
      },
      search: '',
      headers: [
        {
          text: 'Агротехник тадбир номи',
          align: 'start',
          sortable: false,
          value: 'arrangements_name',
        },
        {
          text: 'трактор русуми',
          align: 'start',
          sortable: false,
          value: 'model',
        },
        {
          text: 'машина русуми ёки иш воситаси ',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          sortable: false,
          text: 'бошла-ниши',
          align: 'start',
          value: 'start_time',
        },
        {
          text: 'тугаши',
          align: 'start',
          value: 'end_time',
          sortable: false,
        },
        {
          text: 'давомийлиги',
          align: 'start',
          value: 'days_to_finish',
          sortable: false,
        },
        {
          text: '1 гектар учун норма',
          align: 'start',
          value: '1_gektar_norma',
          sortable: false,
        },
        {
          text: 'Тадбир ўтказиладиган майдон, %',
          align: 'start',
          value: 'maydon_procent',
          sortable: false,
        },
        {
          text: 'Тадбир ўтказиладиган майдон, гектар',
          align: 'start',
          value: 'maydon_gektar',
          sortable: false,
        },
        {
          text: 'жами миқ-дори',
          align: 'start',
          value: 'result',
          sortable: false,
        },
        {
          text: 'Кунлик меъёри (норма)',
          align: 'start',
          value: 'tractor_norma',
          sortable: false,
        },
        {
          text: 'Смена давомийлиги, соат',
          value: 'shift_time',
          sortable: false,
        },
        {
          text: 'Сменалик коэффициенти (1,0; 1,5 ёки 2,0)',
          value: 'shift_coefficient',
          sortable: false,
        },
        {
          text: 'смена-лик меъёри (ҳисоб)',
          value: 'workload',
          sortable: false,
        },
        {
          text: 'механи-заторнинг иш куни',
          value: "days_of_shift",
          sortable: false,
        },
        {
          text: 'Ишчининг иш куни',
          value: "day_of_shift",
          sortable: false,
        },
        {
          text: 'Жалб этиладиган техника ёки одам сони',
          value: "Jalo",
          sortable: false,
        },
        {
          text: 'Техника ишлатилган жами вақт, соат',
          value: "work_hours",
          sortable: false,
        },
        {
          text: 'механи-затор-нинг разряди',
          value: "discharge",
          sortable: false,
        },
        {
          text: 'Ишчининг разряди',
          value: "discharge_human",
          sortable: false,
        },
        {
          text: 'механизаторнинг иш хақи',
          value: "work_machine",
          sortable: false,
        },
        {
          text: 'ишчининг иш хақи',
          value: "work_human",
          sortable: false,
        },

      ],
      page: 1,
      per_page: null,
    }
  },
  methods: {
    showBorder() {
      return {border: 'thin solid rgba(0,0,0,0.3)'}
    },
  },
  mounted() {

  },
  watch: {},
  computed: {
    tech_card() {
      return this.$store.getters.tech_card
    },
    loading() {
      return this.$store.getters.tech_card_loading
    },
    land: {
      get() {
        return this.$store.getters.land
      },
      set(value) {
        this.$store.commit('land', value)
      }
    },
    plant_type: {
      get() {
        return this.$store.getters.plant_type
      },
      set(value) {
        this.$store.commit('plant_type', value)
      }
    },
  }

}
</script>

<style scoped>

.my-border {
  border: thin solid #969696;
}

</style>