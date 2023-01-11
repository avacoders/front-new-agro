<template>
  <div class="text-center ml-auto">
    <v-dialog
        v-model="dialog"
        width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Агротехник тадбир яратиш
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <v-row justify="center">
                <v-col
                    cols="12"
                    md="12"
                >
                  <v-text-field
                      v-model="name"
                      :counter="255"
                      label="Nomi (uz)"
                      required
                      outlined
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="12"
                >
                  <v-text-field
                      v-model="phase"
                      label="Даври"
                      outlined
                      required
                      type="number"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="12"
                >
                  <v-text-field
                      v-model="index"
                      label="Индекси"
                      type="number"
                      required
                      outlined
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    md="12"
                >
                  <v-select :items="plant_types"
                            label="Экин тури"
                            outlined
                            v-model="plant_type"
                            :item-text="(region) => region.name_uz"
                            return-object
                            required
                            :item-value="(region) => region.id"
                            :rules="[rules.required]"
                  >
                  </v-select>
                </v-col>

              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="secondary"
              text
              @click="cancel"
          >
            Bekor qilish
          </v-btn>
          <v-btn
              color="primary"
              text
              @click="save"
              :disabled="loading"
              :loading="loading"
          >
            Tasdiqlash
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
export default {
  name: "EditArrangement",
  data() {
    return {
      valid: false,
      name: null,
      phase: null,
      index: null,
      plant_type: null,
      rules: {
        required: value => !!value || "Bu maydon to'ldirilishi shart",
        max: value => value.length <= 255 || "Max 255 ta belgi"
      }
    }
  },
  props: {
    editingItem: {
      type: Object,
      default: () => {
      }
    }
  },
  watch: {
    editingItem: {
      handler: function (val) {
        this.name = val.name;
        this.phase = val.phase;
        this.index = val.index;
        this.plant_type = val.plant;
      },
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch('getAllPlantTypes')
  },
  methods: {
    save() {
      this.$store.dispatch('updateRegion', this.editingRegion)
    },
    cancel(){
      this.dialog = false
      this.name = null
      this.index = null
      this.phase = null
      this.plant_type = null
    }
  },
  computed: {
    plant_types: {
      get() {
        return this.$store.getters.all_plant_types
      },
      set(value){
        this.$store.commit('set_all_plant_types', value)
      }

    },
    dialog: {
      get() {
        return this.$store.getters.editArrangementDialog
      },
      set(value) {
        this.$store.commit('editArrangementDialog', value)
      }
    },
    loading: {
      get() {
        return this.$store.state.regions_loading
      },
      set(value) {
        this.$store.commit('regions_loading', value)
      }
    }
  },
}
</script>

<style scoped>

</style>