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
          <v-form v-model="valid" v-if="mfy !== null">
            <v-container>
              <v-row justify="center">
                <v-col
                    cols="12"
                    md="6"
                >
                  <v-text-field
                      v-model="mfy.name_uz"
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
                      v-model="mfy.name_ru"
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
                      v-model="mfy.mfy_code"
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
  name: "EditMfy",
  data() {
    return {
      valid: false,
      mfy: null,
    }
  },
  props: {
    editingMfy: {
      type: Object,
      default: () => {
      }
    }
  },
  updated() {
    if (this.editingMfy !== null) {
      this.mfy = this.editingMfy
    }
  },
  mounted() {
    this.mfy = this.editingMfy
  },
  methods: {
    save() {
      this.$store.dispatch('updateMfy', this.editingMfy)
    },
    cancel(){
      this.$store.commit('editMfyDialog', false)
      this.mfy = null
    }
  },
  computed: {
    dialog: {
      get() {
        return this.$store.getters.editMfyDialog
      },
      set(value) {
        this.$store.commit('editMfyDialog', value)
      }
    },
    loading: {
      get() {
        return this.$store.state.mfys_loading
      },
      set(value) {
        this.$store.commit('mfys_loading', value)
      }
    }
  },
}
</script>

<style scoped>

</style>