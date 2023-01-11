<template>
  <div class="text-center ml-auto">
    <v-dialog
        v-model="dialog"
        width="700"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            class="ml-auto"
            rounded
            width="100"
        >
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>

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
                            :item-text="(plant) => plant.name_uz"
                            return-object
                            required
                            :item-value="(plant) => plant.id"
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
              @click="cancel()"
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
  name: "CreateArrangement",
  data() {
    return {
      valid: false,
      name: null,
      index: null,
      phase: null,
      plant_type: null,
      rules: {
        required: value => !!value || "Required.",
        max: v => v.length <= 255 || "Max 20 characters",
      },
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    plant_types: {
      get(){
        return this.$store.getters.all_plant_types
      },
      set(value){
        this.$store.commit('all_plant_types', value)
      }
    },
    dialog: {
      get() {
        return this.$store.getters.creatingArrangementDialog
      },
      set(value) {
        this.$store.commit('creatingArrangementDialog', value)
      }
    }
  },
  mounted() {
    this.$store.dispatch('getAllPlantTypes', true)
  },
  methods: {
    cancel(){
      this.dialog = false
      this.name = null
      this.index = null
      this.phase = null
      this.plant_type_id = null
      this.$store.commit('creatingArrangementDialog', false)

    },
    save() {
      // this.$store.dispatch("storeArrangement", {
      //   name: this.name,
      //   phase: this.phase,
      //   index: this.index,
      //   plant_id: this.plant_type ? this.plant_type.id : null
      // })
    }
  }
}
</script>

<style scoped>

</style>