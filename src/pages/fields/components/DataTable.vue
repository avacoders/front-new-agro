<template>
  <v-card class="mt-4">
    <v-data-table
        :headers="headers"
        :items="fields"
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
    <delete-district :deleting-item="deletingItem"></delete-district>
    <edit-district :editing-district="editingItem"></edit-district>
  </v-card>

</template>

<script>
import DeleteDistrict from "@/pages/fields/components/DeleteDistrict";
import EditDistrict from "@/pages/fields/components/EditDistrict";

export default {
  name: "DataTable",
  components: {EditDistrict, DeleteDistrict},
  comments: {
    DeleteDistrict,
    EditDistrict
  },
  data() {
    return {
      deletingItem: {},
      editingItem: {
        name_uz: "",
        name_ru: "",
        district_code: 0,
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
          text: 'Soato kodi',
          align: 'start',
          filterable: true,
          value: 'district_code',
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
      this.$store.commit('deleteDistrictDialog', true)
    },
    setEditing(item) {
      this.editingItem = item;
      this.$store.commit('editDistrictDialog', true)
    }
  },
  mounted() {

  },
  computed: {
    fields() {
      return this.$store.getters.fields
    },
    loading() {
      return this.$store.getters.fields_loading
    }
  }

}
</script>

<style scoped>

</style>