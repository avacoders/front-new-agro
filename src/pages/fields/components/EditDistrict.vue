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
          <v-form v-model="valid" v-if="district">
            <v-container>
              <v-row justify="center">
                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="district.name_uz"
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
                      v-model="district.name_ru"
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
                  <v-select :items="regions"
                            label="Viloyat"
                            outlined
                            v-model="district.region"
                            :item-text="(region) => region.name_uz"
                            :item-value="(region) => region.region_code"
                            :item-key="(region) => region"
                            return-object
                            required
                  >
                  </v-select>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="district.district_code"
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
  name: "EditDistrict",
  data() {
    return {
      valid: false,
      district: null,
      selected_region: {},
    }
  },
  props: {
    editingDistrict: {
      type: Object,
      default: () => {
      }
    }
  },
  updated() {
    if (this.editingDistrict !== null) {
      this.district = this.editingDistrict
    }
  },
  mounted() {
    this.district = this.editingDistrict
    this.$store.dispatch('getRegions')
  },
  methods: {
    save() {
      this.$store.dispatch('updateDistrict', this.editingDistrict)
    },
    cancel() {
      this.$store.commit('editDistrictDialog', false)
      this.district = null
    }
  },
  computed: {
    dialog: {
      get() {
        return this.$store.getters.editDistrictDialog
      },
      set(value) {
        this.$store.commit('editDistrictDialog', value)
      }
    },
    regions() {
      return this.$store.getters.regions
    },
    loading: {
      get() {
        return this.$store.state.districts_loading
      },
      set(value) {
        this.$store.commit('districts_loading', value)
      }
    }
  },
}
</script>

<style scoped>

</style>