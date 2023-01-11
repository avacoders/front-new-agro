<template>
  <div class="text-center ml-auto">
    <v-dialog
        v-model="dialog"
        width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Добавить регион
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" v-if="region !== null">
            <v-container>
              <v-row justify="center">
                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="region.name_uz"
                      :counter="255"
                      label="Nomi (uz)"
                      required
                      outlined
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="region.name_ru"
                      :counter="255"
                      label="Nomi (ru)"
                      outlined
                      required
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="region.region_code"
                      label="Soato kodi"
                      type="number"
                      required
                      outlined
                  ></v-text-field>
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
  name: "EditRegion",
  data() {
    return {
      valid: false,
      region: null,
    }
  },
  props: {
    editingRegion: {
      type: Object,
      default: () => {
      }
    }
  },
  updated() {
    if (this.editingRegion !== null) {
      this.region = this.editingRegion
    }
  },
  mounted() {
    this.region = this.editingRegion
  },
  methods: {
    save() {
      this.$store.dispatch('updateRegion', this.editingRegion)
    },
    cancel(){
      this.$store.commit('editRegionDialog', false)
      this.region = null
    }
  },
  computed: {
    dialog: {
      get() {
        return this.$store.getters.editRegionDialog
      },
      set(value) {
        this.$store.commit('editRegionDialog', value)
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