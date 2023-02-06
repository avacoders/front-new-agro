<template>
    <div class="text-center">
      <v-dialog
          v-model="dialog"
          width="500"
      >
        <v-card>
          <v-card-title >
            Siz rostan ham {{ deletingItem.name_uz }}ni o'chirmoqchimisiz?
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
  name: "DeletePlantType",
  props: {
    deletingItem: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    deleteItem() {
      this.dialog = false;
    }
  },

  computed: {
    loading: {
      get() {
        return this.$store.getters.plant_types_loading
      }
    },
    dialog: {
      get() {
        return this.$store.getters.deletePlantTypeDialog;
      },
      set(value) {
        this.$store.commit("deletePlantTypeDialog", value);
      },
    },
  }
}
</script>

<style scoped>

</style>