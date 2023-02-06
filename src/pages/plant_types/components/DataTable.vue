<template>
  <v-card class="mt-4">
<!--    <v-card-title>-->
<!--      <v-text-field-->
<!--          v-model="search"-->
<!--          append-icon="mdi-magnify"-->
<!--          label="Search"-->
<!--          single-line-->
<!--          hide-details-->
<!--      ></v-text-field>-->
<!--    </v-card-title>-->
    <v-data-table
        :headers="headers"
        :items="plant_types"
        :search="search"
        :loading="loading"
        :items-per-page="25"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn fab x-small color="primary" @click="setEditing(item)">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn fab x-small color="error" class="ml-2" @click="setDeleting(item)">
          <v-icon>
            mdi-trash-can
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <delete-region :deleting-item="deletingItem"></delete-region>
    <edit-region :editingRegion="editingItem"></edit-region>
  </v-card>

</template>

<script>
import DeleteRegion from "@/pages/plant_types/components/DeletePlantType";
import EditRegion from "@/pages/plant_types/components/EditPlantType";

export default {
  name: "DataTable",
  components: {EditRegion, DeleteRegion},
  comments: {
    DeleteRegion,
    EditRegion
  },
  data() {
    return {
      deletingItem: {},
      editingItem: {
        name_uz: "",
        name_ru: "",
        region_code: 0,
      },
      search: '',
      headers: [
        {
          text: 'Nomi (uz)',
          align: 'start',
          filterable: true,
          value: 'name_uz',
        },
        {
          text: 'Nomi (ru)',
          align: 'start',
          filterable: true,
          value: 'name_ru',
        },
        {
          text: 'Soato kodi',
          align: 'start',
          filterable: true,
          value: 'region_code',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        },
      ],
    }
  },
  methods: {
    setDeleting(item) {
      this.deletingItem = item;
      this.$store.commit('deletePlantTypeDialog', true)
    },
    setEditing(item) {
      this.editingItem = item;
      this.$store.commit('editPlantTypeDialog', true)
    }
  },
  mounted() {
    this.$store.dispatch("getPlantTypes")
  },
  computed: {
    plant_types() {
      return this.$store.getters.plant_types
    },
    loading() {
      return this.$store.getters.plant_types_loading
    }
  }

}
</script>

<style scoped>

</style>