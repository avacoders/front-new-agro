<template>
    <div class="text-center">
      <v-dialog
          v-model="dialog"
          width="500"
      >
        <v-card>
          <v-card-title >
            Siz rostan ham "{{ deletingItem.arrangements_name }}"ni o'chirmoqchimisiz?
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
      this.$store.dispatch('delete_tech_card', {id : this.deletingItem.id})
    }
  },

  computed: {
    loading: {
      get() {
        return this.$store.getters.tech_card_loading
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