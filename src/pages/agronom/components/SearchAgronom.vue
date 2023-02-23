<template>
  <div class="px-3">
    <div class="d-flex" style="gap: 12px">
      <div>
        <v-select :items="regions"
                  label="Вилоят"
                  outlined
                  dense
                  v-model="region"
                  :item-text="(region) => region.name_uz"
                  return-object
                  required
                  :item-value="(plant) => plant.id"
                  :rules="[rules.required]"
        >
        </v-select>
      </div>
      <div>
        <v-select :items="districts"
                  label="Туман"
                  outlined
                  dense
                  v-model="district"
                  :item-text="(district) => district.name_uz"
                  return-object
                  required
                  :item-value="(plant) => plant.id"
                  :rules="[rules.required]"
        >
        </v-select>
      </div>
      <div>
        <v-select :items="plant_types"
                  label="Экин тури"
                  outlined
                  dense
                  v-model="plant_type"
                  :item-text="(plant) => plant.name_uz"
                  return-object
                  required
                  :item-value="(plant) => plant.id"
                  :rules="[rules.required]"
        >
        </v-select>
      </div>
      <div>
        <v-btn
            color="success"
            :disabled="!district.district_code || !plant_type.id"
            @click="$store.dispatch('generate_datetimes', {district_code: district.district_code, plant_id: plant_type.id})"
        >Тех. картани яратиш
        </v-btn>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "SearchAgronom",
  data() {
    return {
      tax_number: null,
      is_done: false,
      deletingItem: null,
      region: {},
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
    this.$store.dispatch('getRegions')
  },
  watch: {
    region: {
      handler: function (val) {
        this.$store.dispatch('getDistrictsByRegionCode', {code: val.region_code})
      },
      deep: true
    },
  },
  computed: {
    plant_type: {
      get() {
        return this.$store.getters.agronom_plant_type
      },
      set(value) {
        this.$store.commit('agronom_plant_type', value)
      }
    },
    district: {
      get() {
        return this.$store.getters.agronom_district
      },
      set(value) {
        this.$store.commit('agronom_district', value)
      }
    },
    selected_land: {
      get() {
        return this.$store.getters.land
      },
      set(value) {
        this.$store.commit('land', value)
      }
    },
    row_space: {
      get() {
        return this.$store.getters.row_space
      },
      set(value) {
        this.$store.commit('row_space', value)
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
    tech_card() {
      return this.$store.getters.tech_card
    },
    districts: {
      get() {
        return this.$store.getters.districts;
      },
      set(value) {
        this.$store.commit('districts', value);
      }
    },
    regions: {
      get() {
        return this.$store.getters.regions;
      },
      set(value) {
        this.$store.commit('regions', value);
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