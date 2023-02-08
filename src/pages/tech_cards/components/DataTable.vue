<template>
  <v-card class="mt-4" v-if="tech_card.phases.length">
    <v-card-title>
<!--      <v-row>-->
<!--        <v-col  v-for="(parameter, index) in tech_card.parameters" v-bind:key="`${index}_parameter`">-->
<!--          <v-simple-table>-->
<!--            <thead>-->
<!--            <tr>-->
<!--            </tr>-->
<!--            </thead>-->
<!--            <tbody>-->
<!--            <tr>-->
<!--              <td :style="showBorder">Технологиялар рақами</td>-->
<!--              <td>{{ parameter.id }}</td>-->
<!--            </tr>-->
<!--            </tbody>-->
<!--          </v-simple-table>-->
<!--        </v-col>-->
<!--      </v-row>-->
    </v-card-title>
    <div>
      <v-expansion-panels>
        <v-expansion-panel
            v-for="phase in tech_card.phases"
            v-bind:key="phase.id"
        >
          <v-expansion-panel-header>
            {{ phase.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table
                fixed-header
                height="90vh">
              <template v-slot:default>
                <thead>
                <tr>
                  <th v-for="header in headers" v-bind:key="header.value"
                      style="border: thin solid rgba(0,0,0,0.3); height: 100px">
                    {{ header.text }}
                  </th>
                </tr>
                </thead>

                <draggable v-model="phase.arrangements" v-bind:key="`${phase.id}_draggable`" :move="detect"
                           v-if="phase.arrangements.length && phase.arrangements[0].copy" tag="tbody">
                  <template v-for="arrangement in phase.arrangements">
                    <tr v-bind:key="`${phase.id}_${arrangement.id}`">
                      <template v-for="header in headers">
                        <td v-bind:key="`${header.value}_${arrangement.id}`" :style="showBorder()"
                            style="position: relative;">
                          {{ arrangement[header.value] }}
                          <template v-if="['result', 'tractor_norma'].includes(header.value)">
                            {{ arrangement.unit }}
                          </template>
                          <template v-if="header.value === 'actions' && arrangement.copy">
                            <div class="d-flex " style="gap: 4px">
                              <v-btn
                                  fab
                                  elevation="0"
                                  @click="editItem(arrangement, arrangement.index,phase.id)"
                                  color="primary" x-small>
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                  fab
                                  @click="deleteItem(arrangement)"
                                  elevation="0"
                                  color="error" x-small>
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>
                              <v-btn
                                  fab
                                  elevation="0"
                                  class="add-btn"
                                  @click="addItem(arrangement, arrangement.index + 1 ,phase.id)"
                                  color="success" x-small>
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </div>
                          </template>
                        </td>
                      </template>
                    </tr>
                  </template>
                </draggable>
                <template v-if="!(phase.arrangements.length && phase.arrangements[0].copy)">

                  <template v-for="arrangement in phase.arrangements">
                    <tr v-bind:key="`${phase.id}_${arrangement.id}`">
                      <template v-for="header in headers">
                        <td v-bind:key="`${header.value}_${arrangement.id}`" :style="showBorder()"
                            style="position: relative;">
                          {{ arrangement[header.value] }}
                          <template v-if="['result', 'balance_norm'].includes(header.value)">
                            {{ arrangement.unit }}
                          </template>
                          <template v-if="header.value === 'actions' && arrangement.copy">
                            <div class="d-flex " style="gap: 4px">
                              <v-btn
                                  fab
                                  elevation="0"
                                  @click="editItem(arrangement, arrangement.index,phase.id)"
                                  color="primary" x-small>
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                  fab
                                  @click="deleteItem(arrangement)"
                                  elevation="0"
                                  color="error" x-small>
                                <v-icon>mdi-minus</v-icon>
                              </v-btn>
                              <v-btn
                                  fab
                                  elevation="0"
                                  class="add-btn"
                                  @click="addItem(arrangement, arrangement.index + 1 ,phase.id)"
                                  color="success" x-small>
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </div>
                          </template>
                        </td>
                      </template>
                    </tr>
                  </template>

                </template>
                <tr v-bind:key="`${phase.id}_all`">
                  <th colspan="14" :style="showBorder()">{{ phase.name }}</th>
                  <th :style="showBorder()">{{ phase.phase_overall.days_of_shift }}</th>
                  <th :style="showBorder()">{{ phase.phase_overall.days_of_shift_human }}</th>
                </tr>
              </template>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <delete-arrangement
        :deletingItem="deletingItem"
    ></delete-arrangement>
    <create-arrangement
        :index="index"></create-arrangement>
    <edit-arrangement
        :editingItem="editingItem"></edit-arrangement>
  </v-card>

</template>

<script>
import $ from "jquery";

window.$ = $
import DeleteArrangement from "./DeleteArrangement";
import CreateArrangement from "./CreateArrangement";
import EditArrangement from "@/pages/tech_cards/components/EditArrangement";
import draggable from "vuedraggable";

export default {
  name: "DataTable",
  data() {
    return {
      parameters: {
        headers: [
          {
            key: "tuzatish",
            title: "Тузатиш (дала паспорти бўйича) коэффициенти",
            element: [
              {
                key: "mehaniz_ish",
                title: "Механизация иш унумига тузатиш коэффициенти"
              },
              {
                key: "kul_kuchida_ish",
                title: "Қўл кучида иш унумига тузатиш коэффиц."
              },
              {
                key: "yonligiga_koef",
                title: "Ёнилғига тузатиш коэффициенти"
              },

            ]
          },
          {
            key: "discharges",
            title: "2022 йил 1 июн нархлари бўйича сменалик иш хақи тариф сеткаси",
            element: [
              {
                key: "mehaniz_ish",
                title: "Механизация иш унумига тузатиш коэффициенти"
              },
              {
                key: "kul_kuchida_ish",
                title: "Қўл кучида иш унумига тузатиш коэффиц."
              },
              {
                key: "yonligiga_koef",
                title: "Ёнилғига тузатиш коэффициенти"
              },

            ]
          }
        ]
      },
      deletingItem: {},
      editingItem: {},
      index: null,
      search: '',
      headers: [
        {
          text: '',
          align: 'start',
          sortable: false,
          value: 'actions',
        },
        {
          text: 'Агротехник тадбир номи',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: 'трактор русуми',
          align: 'start',
          sortable: false,
          value: 'worker',
        },
        {
          text: 'машина русуми ёки иш воситаси ',
          align: 'start',
          sortable: false,
          value: 'agregat',
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
          value: 'number_of_days',
          sortable: false,
        },
        {
          text: '1 гектар учун норма',
          align: 'start',
          value: 'gektar_norma',
          sortable: false,
        },
        {
          text: 'Тадбир ўтка-зила-диган май-дон, %',
          align: 'start',
          value: 'square_procent',
          sortable: false,
        },
        {
          text: 'Тадбир ўтказиладиган майдон, гектар',
          align: 'start',
          value: 'square_gektar',
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
          value: 'balance_norm',
          sortable: false,
        },
        {
          text: 'Сме-на даво-мий-лиги, соат',
          value: 'shift_continuity',
          sortable: false,
        },
        {
          text: 'Сме-на-лик ко-эффи-циенти (1,0; 1,5 ёки 2,0)',
          value: 'smenalik_koeffitsiyenti',
          sortable: false,
        },
        {
          text: 'смена-лик меъёри (ҳисоб)',
          value: 'workload',
          sortable: false,
        },
        {
          text: 'механи-затор-нинг иш куни',
          value: "days_of_shift",
          sortable: false,
        },
        {
          text: 'Ишчи-нинг иш куни',
          value: "day_of_shift",
          sortable: false,
        },
        {
          text: 'Жалб этила-диган тех-ника ёки одам сони',
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
        {
          text: 'Ёнилғи сарфи, литр, бир бир-ликка',
          value: "bir_birlika_hisob",
          sortable: false,
        },
        {
          text: 'Ёнилғи сарфи, литр, жами ҳаж-мига',
          value: "jami_xaj_miga",
          sortable: false,
        },
        {
          text: '1 соатлик иши учун амортизация ажратмаси, Энергетик восита',
          value: "amor_energitic",
          sortable: false,
        },
        {
          text: '1 соатлик иши учун амортизация ажратмаси, ҚХМ',
          value: "amor_kxm",
          sortable: false,
        },
        {
          text: '1 соатлик иши учун таъмирлаш ва ТХКга ажратма, сўм,Энергетик восита',
          value: "tamir_energitic",
          sortable: false,
        },
        {
          text: '1 соатлик иши учун таъмирлаш ва ТХКга ажратма, сўм, ҚХМ',
          value: "tamir_kxm",
          sortable: false,
        },
        {
          text: 'Аморти-зация',
          value: "amortizciya",
          sortable: false,
        },
        {
          text: 'Таъмир-лаш',
          value: "tamirlash",
          sortable: false,
        },
        {
          text: 'Бошқа',
          value: "boshka",
          sortable: false,
        },
        {
          text: 'Жами харажатлар, минг сўм',
          value: "jami",
          sortable: false,
        },
      ],
      page: 1,
      per_page: null,
      editingElement: null,
      editingIndex: null,
      editing: false,
    }
  },
  components: {
    EditArrangement,
    DeleteArrangement,
    CreateArrangement,
    draggable
  },
  methods: {
    save() {
      this.$store.commit('tech_card_loading', true)
      this.$store.dispatch('save_tech_card', this.tech_card).then(() => {
        this.$store.commit('tech_card_loading', false)
      })
    },
    editItem(item, index, phase) {
      this.editingItem = item
      this.$store.commit('phase', phase)
      this.$store.commit('index', index)
      this.$store.commit('edit_tech_card_dialog', true)
    },
    showBorder() {
      return {border: 'thin solid rgba(0,0,0,0.3)', height: '100px', padding: '10px'}
    },
    deleteItem(item) {
      this.deletingItem = item
      this.$store.commit('delete_tech_card_dialog', true)
    },
    addItem(item, index, phase) {
      this.$store.commit('add_tech_card_dialog', true)
      this.$store.commit('phase', phase)
      this.$store.commit('index', index)
    },
    detect(evt) {
      this.editingElement = evt.draggedContext.element;
      this.editingIndex = evt.draggedContext.index;
      this.editing = false
    },
  },
  mounted() {
  },
  watch: {
    tech_card: {
      handler: function (newVal, oldVal) {
        var element = this.editingElement;
        for (var item of oldVal.phases) {
          for (var arrangement of item.arrangements) {
            if (element && element.id && arrangement.id === element.id) {
              this.$store.commit('phase', item.id)
              this.$store.commit('index', this.editingIndex)
              arrangement.row_space = this.row_space
              if (!this.editing && arrangement.copy) {
                this.$store.dispatch('update_tech_card_arrangement', {item: arrangement, tech_card_id: arrangement.id})
                this.editing = true
              }
            }
          }
        }

      },
      deep: true
    }
  },
  computed: {
    row_space: {
      get() {
        return this.$store.getters.row_space
      },
      set(value) {
        this.$store.commit('row_space', value)
      }
    },
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

th, td {
  text-align: left;
}

.add-btn {
  position: absolute;
  right: 50%;
  bottom: 0;
  opacity: 1;
  z-index: 1;
  transform: translate(50%, 50%);
}
</style>