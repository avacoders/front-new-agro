<template>
    <div class="text-center">
      <v-dialog
          v-model="dialog"
          width="500"
      >
        <v-card>
          <v-card-title >
            Siz rostan ham "{{ deletingItem.name }}"ni o'chirmoqchimisiz?
          </v-card-title>


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
                color="error"
                text
                :disabled="loading"
                :loading="loading"
                @click="deleteItem">
              O'chirish
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
export default {
  name: "DeleteArrangement",
  props: {
    deletingItem: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    deleteItem() {
      this.$store.dispatch('delete_tech_card', {id : this.deletingItem.id}).then(() => {
        this.$store.commit('gis_bridge_lands_loading', true)
        setTimeout(() => {
          this.$store.dispatch('get_tech_card', {selected_land: this.land, plant_type: this.plant_type})
          this.$swal({
            title: 'O\'chirildi',
            text: 'Muvaffaqiyatli o\'chirildi',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
          this.dialog = false
        }, 1)
      })
    }
  },

  computed: {
    land: {
      get() {
        return this.$store.getters.land;
      },
    },
    plant_type: {
      get() {
        return this.$store.getters.plant_type
      },
    },
    loading: {
      get() {
        return this.$store.getters.gis_bridge_lands_loading
      }
    },
    dialog: {
      get() {
        return this.$store.getters.delete_tech_card_dialog;
      },
      set(value) {
        this.$store.commit("delete_tech_card_dialog", value);
      },
    },
  }
}
</script>

<style scoped>

</style>