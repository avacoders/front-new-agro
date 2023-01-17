<template>
  <div>
    <v-row>
      <v-col cols="12" sm="6" md="6">
        <v-text-field
            v-model="tax_number"
            label="ИНН"
            outlined
            :loading="loading"
        />
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-btn x-large color="primary" @click="$store.dispatch('get_gis_bridge_lands', {tax_number})">Излаш</v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="3" v-if="lands.length">
        <v-select :items="plant_types"
                  label="Экин тури"
                  outlined
                  v-model="plant_type"
                  :item-text="(plant) => plant.name_uz"
                  return-object
                  required
                  :item-value="(plant) => plant.id"
                  :rules="[rules.required]"
        >
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="2" v-if="lands.length">
        <v-select :items="row_spaces"
                  label="Қатор оралиғи"
                  outlined
                  v-model="row_space"
                  return-object
                  required
                  :rules="[rules.required]"
        >
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3" v-if="lands.length">
        <v-select :items="lands"
                  label="Кадастр рақами"
                  outlined
                  v-model="selected_land"
                  :item-text="(land) => land.properties.cadastral_number"
                  return-object
                  required
                  :item-value="(plant) => plant.id"
                  :rules="[rules.required]"
        >
        </v-select>
      </v-col>
      <v-col cols="12" sm="6" md="4" v-if="lands.length">
        <v-btn
            color="success"
            x-large
            :disabled="!(selected_land && plant_type && row_space)"
            @click="$store.dispatch('get_tech_card', {selected_land, plant_type})"
        >Тех. картани яратиш</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "SearchTechCard",
  data() {
    return {
      tax_number: null,
      plant_type: null,
      is_done: false,
      row_space: 60,
      row_spaces: [
          45, 60, 90
      ],
      rules: {
        required: value => !!value || "Required.",
        max: v => v.length <= 255 || "Max 20 characters",
      },
    }
  },
  mounted() {
    this.$store.dispatch('getAllPlantTypes')
  },
  computed: {
    selected_land:{
      get(){
        return this.$store.getters.land
      },
      set(value){
        this.$store.commit('land', value)
      }
    },
    loading: {
      get() {
        return this.$store.getters.gis_bridge_lands_loading;
      },
      set(value) {
        this.$store.commit('gis_bridge_lands_loading', value);
      }
    },
    lands: {
      get() {
        return this.$store.getters.gis_bridge_lands;
      },
      set(value) {
        this.$store.commit('gis_bridge_lands', value);
      }
    },
    plant_types: {
      get() {
        return this.$store.getters.all_plant_types;
      },
      set(value) {
        this.$store.commit('set_all_plant_types', value);
      }
    },

  },
}
</script>

<style scoped>

</style>