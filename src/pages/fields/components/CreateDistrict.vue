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
          Дала пасспортини яратиш
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
                      v-model="cadastor_num"
                      :counter="255"
                      label="Кадастр рақами"
                      required
                      outlined
                      dense
                  ></v-text-field>
                </v-col>

                <v-col
                    cols="12"
                    md="12"
                >
                  <v-select
                  v-model="tusiclar_ulushi"
                  dense
                  outlined
                  label="Тўсиқлар эгаллаган майдоннинг жами майдондаги улуши, %"
                  :items="tusiqlar"
                  :item-text="(item) => item.label"
                  >

                  </v-select>
                </v-col>
                <v-col
                    cols="12"
                    md="12"
                >
                  <v-select :items="toshlok_daralari"
                            label="Тошлоқлик даражаси"
                            outlined
                            dense
                            v-model="toshlok_darasi"
                            :item-text="(item) => item.label"
                            return-object
                            required
                            :item-value="(item) => item.value"
                  >
                  </v-select>
                </v-col>

                <v-col
                    cols="12"
                    md="12"
                >
                  <v-select :items="groups"
                            label="Дала гуруҳи"
                            outlined
                            dense
                            v-model="dala_guruhi"
                            :item-text="(item) => item.label"
                            return-object
                            required
                            :item-value="(item) => item.value"
                  >
                  </v-select>
                </v-col>
                <v-col
                    cols="12"
                    md="12"
                >
                  <v-select :items="qiyaliklar"
                            label="Ер рельефининг қиялиги (градусларда)"
                            outlined
                            dense
                            v-model="dala_guruhi"
                            :item-text="(item) => item.label"
                            return-object
                            required
                            :item-value="(item) => item.value"
                  >
                  </v-select>
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
              @click="$store.commit('creating_field_dialog', false)"
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
      cadastor_num: "",
      tusiclar_ulushi: "",
      gildirakli_va_zanjirli: "",
      gildirakli: "",
      zanjirli: "",
      kp1: "",
      kp2: "",
      t1: "",
      t2: "",
      toshlok_darasi: "",
      toshlok_darasi_yani: "",
      ish_umum: "",
      yonilgi_safirga: "",
      dala_guruhi: "",
      er_haydashdan: "",
      er_haydashdan_boshka: "",
      nameRules: [
        v => !!v || 'Nomi kiritilishi shart',
        v => v.length <= 255 || 'Name must be less than 255 characters',
      ],
      tusiqlar: [
        {
          value: 1,
          label: "5% гача"
        },
        {
          value: 2,
          label: "5...10"
        },
        {
          value: 3,
          label: "10...15"
        },
        {
          value: 4,
          label: "15...20"
        },
        {
          value: 5,
          label: "20...25"
        },
        {
          value: 6,
          label: "25...30"
        },
        {
          value: 2,
          label: "30...35"
        },
      ],
      toshlok_daralari: [
        {
          value: 1,
          label: "Тоши йўқ дала",
        },
        {
          value: 2,
          label: "Кучсиз даражада тошлоқ",
        },
        {
          value: 3,
          label: "Ўртача тошлоқ",
        },
        {
          value: 4,
          label: "Юқори даражада тошлоқ",
        }
      ],
      groups: [
        {
          value: 1,
          label: "I"
        },
        {
          value: 2,
          label: "II"
        },
        {
          value: 3,
          label: "III"
        },
        {
          value: 4,
          label: "IV"
        },
        {
          value: 5,
          label: "V"
        }
      ],
      qiyaliklar: [
        {
          value: 1,
          label: "1-3"
        },
        {
          value: 2,
          label: "3-5"
        },
        {
          value: 3,
          label: "5-7"
        },
        {
          value: 4,
          label: "7-9"
        }
      ],
      email: '',
      emailRules: [
        v => !!v || 'Soato kodini kiriting',
      ],
    };
  },
  computed: {
    loading() {
      return this.$store.getters.fields_loading
    },
    dialog: {
      get() {
        return this.$store.getters.creating_field_dialog
      },
      set(value) {
        this.$store.commit('creating_field_dialog', value)
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

  },
  methods: {
    save(){

    }
  }
}
</script>

<style scoped>

</style>