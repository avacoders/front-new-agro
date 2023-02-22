<template>
  <div v-if="tech_card.length">
    <div>
      <v-simple-table
          fixed-header
          height="90vh">
        <template v-slot:default>
          <thead>
          <tr>
            <template v-for="header in headers">
              <th v-if="![ 'checkbox', 'actions' ].includes(header.value) && !(phase.arrangements.length && phase.arrangements[0].copy) || (phase.arrangements.length && phase.arrangements[0].copy)"  v-bind:key="header.value"
                  style="border: thin solid rgba(0,0,0,0.3); height: 100px">
                {{ header.text }}
              </th>
            </template>
          </tr>
          </thead>

          <draggable v-model="tech_card" :move="detect"
                     v-if="tech_card.length" tag="tbody">
            <template v-for="(arrangement, index) in tech_card">
              <tr v-bind:key="`arrangement_${arrangement.id}`">
                <template v-for="header in headers">
                  <template
                      v-if="header.value == 'checkbox' &&( index != 0 && arrangement.group_index != phase.arrangements[index - 1].group_index || index == 0 && phase.arrangements[index].group_index)">
                    <td v-bind:key="`${header.value}_${phase.id}_${arrangement.id}_${index}`"
                        :rowspan="getGroupCount(phase.arrangements, arrangement.group_index)"
                        :style="showBorder()">
                      <v-btn
                          fab
                          @click="delete_group(arrangement.group_index, phase.id)"
                          elevation="0"
                          color="error" x-small>
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </td>
                  </template>

                  <td v-bind:key="`${header.value}_${phase.id}_${arrangement.id}`"
                      v-if="header.value != 'checkbox'" :style="showBorder()"
                      :class="`color-` + arrangement.group_index"
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
                            @click="editItem(arrangement, arrangement.index,phase.id )"
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
        </template>
      </v-simple-table>

    </div>

  </div>

</template>

<script>
import $ from "jquery";

window.$ = $
import draggable from "vuedraggable";

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
          text: 'Агротехник тадбир номи',
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
          value: 'number_of_days',
          sortable: false,
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
  },
  methods: {
    getGroupCount(array, group_index) {
      let count = 0
      for (let i = 0; i < array.length; i++) {
        if (array[i].group_index == group_index)
          count++
      }
      return count
    },
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
      this.$store.commit('group_index', item.group_index)
      this.$store.commit('edit_tech_card_dialog', true)
    },
    showBorder() {
      return {border: 'thin solid rgba(0,0,0,0.3)', height: '100px', padding: '10px'}
    },
    deleteItem(item) {
      this.deletingItem = item
      this.$store.commit('delete_tech_card_dialog', true)
    },
    delete_group(group_index, phase) {
      this.deletingGroup = {
        group_index: group_index,
        phase: phase,
      }
      this.$store.commit('delete_group_dialog', true)
    },
    addItem(item, index, phase) {
      this.$store.commit('add_tech_card_dialog', true)
      this.$store.commit('phase', phase)
      this.$store.commit('index', index)
      this.group_index = item.group_index
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
    tech_card: {
      get() {
        return this.$store.getters.agronom_tech_card
      },
      set(value) {
        this.$store.commit('agronom_tech_card', value)
      }
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