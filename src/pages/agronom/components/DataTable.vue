<template>
  <div >
    <v-expansion-panels v-if="tech_card.phases.length">
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
                <template v-for="header in headers">
                  <th v-bind:key="`${phase.id}_${header.value}`"
                      style="border: thin solid rgba(0,0,0,0.3); height: 100px">
                    {{ header.text }}
                  </th>
                </template>
              </tr>
              </thead>
              <draggable v-model="phase.arrangements" v-bind:key="`${phase.id}_draggable`" :move="detect"
                         v-if="phase.arrangements && phase.arrangements.length" tag="tbody">
                <template v-for="(arrangement) in phase.arrangements">
                  <tr v-bind:key="`${phase.id}_${arrangement.id}`">
                    <template v-for="header in headers">

                      <td v-bind:key="`${header.value}_${phase.id}_${arrangement.id}`"
                          v-if="header.value != 'checkbox'" :style="showBorder()"
                          :class="`color-` + arrangement.group_index"
                          style="position: relative;">
                        <template v-if="editingItem.id != arrangement.id">
                          {{ arrangement[header.value] }}
                        </template>
                        <template v-if="editingItem.id == arrangement.id && header.value != 'actions'">
                          <input-by-type
                              v-model="editingItem[header.value]"
                              :item="editingItem"
                              :index="index"
                              :label="header.text"
                              :phase="phase.id"
                              :type="header.type"></input-by-type>
                        </template>

                        <template v-if="header.value === 'actions'">
                          <template v-if="editingItem.id != arrangement.id">
                            <div class="d-flex " style="gap: 4px">
                              <v-btn
                                  fab
                                  elevation="0"
                                  @click="editItem(arrangement)"
                                  color="primary" x-small>
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                            </div>
                          </template>
                          <template v-if="editingItem.id == arrangement.id">
                            <div class="d-flex " style="gap: 4px">
                              <v-btn
                                  fab
                                  elevation="0"
                                  @click="save()"
                                  :disabled="loading"
                                  :loading="loading"
                                  color="success" x-small>
                                <v-icon>mdi-content-save</v-icon>
                              </v-btn>
                            </div>
                          </template>
                        </template>
                      </td>
                    </template>
                  </tr>
                </template>
              </draggable>
            </template>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>

</template>

<script>
import draggable from "vuedraggable";
import InputByType from "@/pages/tech_cards/components/InputByType";

export default {
  name: "DataTable",
  data() {
    return {
      selecteds: {},
      deletingGroup: null,
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
          editable: false,
        },
        {
          text: 'Агротехник тадбир номи',
          align: 'start',
          sortable: false,
          value: 'name',
          type: "text",
          editable: true,

        },
        {
          sortable: false,
          text: 'Агротехник тадбир бошланиши',
          align: 'start',
          value: 'start_time',
          type: "date",
          editable: true,
        },
        {
          text: 'Агротехник тадбир тугаши',
          align: 'start',
          value: 'end_time',
          sortable: false,
          type: "date",
          editable: true,
        },
        {
          text: 'Агротехник тадбир давомийлиги',
          align: 'start',
          value: 'continuity',
          sortable: false,
          type: "number",
          editable: true,
        }
      ],
      page: 1,
      per_page: null,
      editingElement: null,
      editingIndex: null,
      editing: false,
      group_index: 0,
    }
  },
  components: {
    draggable,
    InputByType
  },
  methods: {

    save() {
      var params = {
        id: this.editingItem.id,
        name: this.editingItem.name,
        start_time: this.editingItem.start_time,
        end_time: this.editingItem.end_time,
        continuity: this.editingItem.continuity,
      }
      this.$store.dispatch('saveTechCard', params).then(() => {
        this.editingItem = {}
        this.$store.dispatch('generate_datetimes', {district_code: this.district.district_code, plant_id: this.plant_type.id} )
      })
    },
    editItem(item) {
      this.editingItem = item
    },
    showBorder() {
      return {border: 'thin solid rgba(0,0,0,0.3)', height: '100px', padding: '10px'}
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
      handler: function () {
        // var element = this.editingElement;
        // for (var item of oldVal.phases) {
        //   for (var arrangement of item.arrangements) {
        //     if (element && element.id && arrangement.id === element.id) {
        //       this.$store.commit('phase', item.id)
        //       this.$store.commit('index', this.editingIndex)
        //       arrangement.row_space = this.row_space
        //       if (!this.editing && arrangement.copy) {
        //         this.$store.dispatch('update_tech_card_arrangement', {item: arrangement, tech_card_id: arrangement.id})
        //         this.editing = true
        //       }
        //     }
        //   }
        // }

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
    tech_card: {
      get() {
        return this.$store.getters.agronom_tech_card
      },
      set(value) {
        this.$store.commit('agronom_tech_card', value)
      }
    },
    loading() {
      return this.$store.getters.agronom_tech_card_loading
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
        return this.$store.getters.agronom_plant_type
      },
      set(value) {
        this.$store.commit('agronom_plant_type', value)
      }
    },
    district: {
      get() {
        return this.$store.getters.agronom_district
      },
      set(value) {
        this.$store.commit('agronom_district', value)
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

.color-1 {
  background-color: #f2f2f2;
}

.color-2 {
  background-color: #dc7272;
}

.color-3 {
  background-color: #cef1b6;
}

.color-4 {
  background-color: #b6c7f1;
}

.color-5 {
  background-color: #68e7e3;
}

.color-6 {
  background-color: #5e5bc2;
}

.color-7 {
  background-color: #d964e1;
}

.color-8 {
  background-color: #f8b938;
}

.color-9 {
  background-color: #2dd3a1;
}

.color-10 {
  background-color: #699b3b;
}

.color-11 {
  background-color: #8b6ce1;
}

.color-12 {
  background-color: #e53655;
}

.color-13 {
  background-color: #48e536;
}

.color-14 {
  background-color: #d07184;
}

.color-15 {
  background-color: #795cef;
}

.color-16 {
  background-color: #ffffff;
}

.color-17 {
  background-color: #e5d636;
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