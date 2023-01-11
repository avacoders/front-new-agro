<template>
  <v-card class="mt-4">
    <v-card-title>
      <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
        :headers="headers"
        :items="arrangements[0]"
        :search="search"
        :loading="loading"
        :items-per-page="25"
        hide-default-footer
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
    <div class="py-3">
      <v-pagination
          v-if="arrangements.length"
          v-model="page"
          :length="arrangements[1][0].total_page"
          total-visible="6"
      ></v-pagination>
    </div>
    <delete-arrangement :deleting-item="deletingItem"></delete-arrangement>
    <edit-arrangement :editing-item="editingItem"></edit-arrangement>
  </v-card>

</template>

<script>
import DeleteArrangement from "@/pages/arrangements/components/DeleteArrangement";
import EditArrangement from "@/pages/arrangements/components/EditArrangement";

export default {
  name: "DataTable",
  components: {EditArrangement, DeleteArrangement},
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
          value: 'name',
        },
        {
          text: 'Даври',
          align: 'start',
          filterable: true,
          value: 'phase',
        },
        {
          text: 'Индекси',
          align: 'start',
          filterable: true,
          value: 'index',
        },
        {
          text: "Экин тури",
          align: 'start',
          filterable: true,
          value: 'plant.name_uz',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        },

      ],
      page: 1,
      per_page: null,
    }
  },
  methods: {
    setDeleting(item) {
      this.deletingItem = item;
      this.$store.commit('deleteArrangementDialog', true)
    },
    setEditing(item) {
      this.editingItem = item;
      this.$store.commit('editArrangementDialog', true)
    }
  },
  mounted() {
    this.$store.dispatch("getArrangements", {page: this.page})
  },
  watch: {
    page(page) {
      this.$router.push({path: this.$route.path, query: {page, per_page: this.per_page} });
    },
    per_page(per_page) {
      this.$router.go({path:this.$route.path, params: {per_page,page: this.page}})
    },
    '$route.query': {
      handler: function(result) {
        var per_page = result.per_page
        var page = result.page ?? 1
        console.log(result);
        var params = {}
        if(page)
          params.page = page
        if(per_page)
          params.per_page = per_page
        this.$store.dispatch("getArrangements", params)
      },
      deep: true,
      immediate: true
    },

  },
  computed: {
    arrangements() {
      return this.$store.getters.arrangements
    },
    loading() {
      return this.$store.getters.regions_loading
    }
  }

}
</script>

<style scoped>

</style>