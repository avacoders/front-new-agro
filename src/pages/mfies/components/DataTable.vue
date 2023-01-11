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
        :items="mfies"
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
    <delete-mfy :deleting-item="deletingItem"></delete-mfy>
<!--    <edit-mfy :editing-item="editingItem"></edit-mfy>-->
  </v-card>

</template>

<script>
import DeleteMfy from "@/pages/mfies/components/DeleteMfy";
// import EditMfy from "@/pages/mfies/components/EditMfy";

export default {
  name: "DataTable",
  components: { DeleteMfy},
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
          text: 'Viloyati',
          align: 'start',
          filterable: true,
          value: 'region.name_uz',
        },
        {
          text: 'Viloyati',
          align: 'start',
          filterable: true,
          value: 'district.name_uz',
        },
        {
          text: 'Soato kodi',
          align: 'start',
          filterable: true,
          value: 'mfy_code',
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
    this.$store.dispatch("getMfies")
  },
  computed: {
    mfies() {
      return this.$store.getters.mfies
    },
    loading() {
      return this.$store.getters.mfies_loading
    }
  }

}
</script>

<style scoped>

</style>