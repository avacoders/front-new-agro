<template>
  <div class="text-center ml-auto">
    <v-dialog
        v-model="dialog"
        width="1500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Агротехник тадбир қўшиш
        </v-card-title>

        <v-card-text class="py-5">
          <v-row>
            <v-col>
              <v-combobox
                  v-model="item"
                  :items="arrangements"
                  label="Combobox"
                  outlined
                  dense

                  :item-text="(item) => item.name"
                  :item-value="(item) => item.id"
                  return-object
              >
                <template v-slot:selection="data">
                  {{ data.item.name ?? "Танланг" }}
                </template>
              </v-combobox>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <template v-if="item.id">
            <v-row class="my-4" v-for="header in headers" v-bind:key="header.value">
              <v-col><h3>{{ header.text }}</h3></v-col>
              <v-col><InputByType
                  v-model="item[header.value]"
                  :options="header.options"
                  :type="header.type"
                  :item="item"
                  :key="header.value"
              ></InputByType></v-col>
            </v-row>
          </template>


        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="secondary"
              text
              @click="dialog = false"
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

import InputByType from "@/pages/tech_cards/components/InputByType";

export default {
  name: "CreateArrangement",
  components: {InputByType},
  props: {

    group_index: {
      type: Number,
      default: 0
    },
  },


  data() {
    return {
      valid: false,
      name_uz: '',
      name_ru: '',
      selected_region: {},
      district_code: 0,
      item: {},
      headers: [
        {
          text: 'Агротехник тадбир номи',
          align: 'start',
          sortable: false,
          value: 'name',
          type: 'textarea',
        },
        {
          sortable: false,
          text: 'бошла-ниши',
          align: 'start',
          value: 'start_time',
          type: 'date',
        },
        {
          text: 'тугаши',
          align: 'start',
          value: 'end_time',
          sortable: false,
          type: 'date',
        },
        {
          text: '1 гектар учун норма',
          align: 'start',
          value: 'gektar_norma',
          sortable: false,
          type: 'number',
        },
        {
          text: 'Тадбир ўтказиладиган майдон, %',
          align: 'start',
          value: 'square_procent',
          sortable: false,
          type: 'number',
        },
        {
          text: 'Кунлик меъёри (норма)',
          align: 'start',
          value: 'balance_norm',
          sortable: false,
          type: 'number',
        },
        {
          text: 'Смена давомийлиги, соат',
          value: 'shift_continuity',
          sortable: false,
          type: 'number',
        },
        {
          text: 'Сменалик коэффициенти (1,0; 1,5 ёки 2,0)',
          value: 'smenalik_koeffitsiyenti',
          sortable: false,
          type: 'number',
        },
        {
          text: 'механи-затор-нинг разряди',
          value: "discharge",
          sortable: false,
          type: 'select',
          options: [
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
          ]
        },
        {
          text: 'Ишчининг разряди',
          value: "discharge_human",
          sortable: false,
          type: 'select',
          options: [
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
          ]
        },
        {
          text: '',
          value: "actions",
          sortable: false,
        },
      ],

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
    arrangements: {
      get() {
        return this.$store.getters.tech_card_arrangements
      },
      set(value) {
        this.$store.commit('tech_card_arrangements', value)
      }
    },
    dialog: {
      get() {
        return this.$store.getters.add_tech_card_dialog
      },
      set(value) {
        this.$store.commit('add_tech_card_dialog', value)
      }
    },
  },
  mounted() {
    this.$store.dispatch('get_tech_card_arrangements')

  },
  methods: {
    showBorder() {
      return {border: 'thin solid rgba(0,0,0,0.3)', height: '100px'}
    },
    save() {
      this.$store.dispatch("add_tech_card_arrangement", {
        item: this.item,
        group_index: this.group_index
      })
    }
  }
}
</script>

<style scoped>

</style>