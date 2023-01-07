<template>
  <div class="text-center ml-auto">
    <v-dialog
        v-model="dialog"
        width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            class="ml-auto"
        >
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Добавить район
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid">
            <v-container>
              <v-row justify="center">
                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="name_uz"
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
                      v-model="name_ru"
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
                            v-model="selected_region"
                            :item-text="(region) => region.name_uz"
                            return-object
                            required
                            :item-value="(region) => region.region_code"
                  >
                  </v-select>
                </v-col>
                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="district_code"
                      label="Soato kodi"
                      type="number"
                      required
                      outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="secondary"
              text
              @click="$store.commit('creatingDistrictDialog', false)"
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
  name: "CreateDistrict",
  data () {
    return {
      valid: false,
      name_uz: '',
      name_ru: '',
      selected_region: {},
      district_code: 0,
      nameRules: [
        v => !!v || 'Nomi kiritilishi shart',
        v => v.length <= 255 || 'Name must be less than 255 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'Soato kodini kiriting',
      ],
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    dialog: {
      get() {
        return this.$store.getters.creatingDistrictDialog
      },
      set(value) {
        this.$store.commit('creatingDistrictDialog', value)
      }
    },
    regions: {
      get() {
        return this.$store.getters.regions
      },
      set(value) {
        this.$store.commit('regions', value)
      }
    },
  },
  mounted() {
    this.$store.dispatch('getRegions')

  },
  methods: {
    save(){
      this.$store.dispatch("storeDistrict", {
        name_uz: this.name_uz,
        name_ru: this.name_ru,
        district_code: this.district_code,
        region_code: this.selected_region.region_code
      })
    }
  }
}
</script>

<style scoped>

</style>