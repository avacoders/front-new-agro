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
          Добавить регион
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
                  <v-text-field
                      v-model="region_code"
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
              @click="$store.commit('creatingRegionDialog', false)"
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
  name: "CreateRegion",
  data () {
    return {
      valid: false,
      name_uz: '',
      name_ru: '',
      region_code: 0,
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
        return this.$store.getters.creatingRegionDialog
      },
      set(value) {
        this.$store.commit('creatingRegionDialog', value)
      }
    }
  },
  methods: {
    save(){
      this.$store.dispatch("storeRegion", {
        name_uz: this.name_uz,
        name_ru: this.name_ru,
        region_code: this.region_code,
      })
    }
  }
}
</script>

<style scoped>

</style>