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
        :items="regions"
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
import DeleteRegion from "@/pages/regions/components/DeleteRegion";
import EditRegion from "@/pages/regions/components/EditRegion";

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
      this.$store.commit('deleteRegionDialog', true)
    },
    setEditing(item) {
      this.editingItem = item;
      this.$store.commit('editRegionDialog', true)
    }
  },
  mounted() {
    this.$store.dispatch("getPlantTypes")
  },
  computed: {
    regions() {
      return this.$store.getters.regions
    },
    loading() {
      return this.$store.getters.regions_loading
    }
  }

}
</script>

<style scoped>

</style>