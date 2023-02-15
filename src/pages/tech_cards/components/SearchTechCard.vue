<template>
  <div class="px-3">
    <div class="d-flex" style="gap: 12px">
      <div>
        <v-text-field
            v-model="tax_number"
            label="ИНН"
            outlined
            dense
            :loading="loading"
        />
      </div>
      <div>
        <v-btn color="primary" @click="$store.dispatch('get_gis_bridge_lands', {tax_number})">Излаш</v-btn>
      </div>
      <template v-if="lands.length">
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
          <v-select :items="row_spaces"
                    label="Қатор оралиғи"
                    outlined
                    v-model="row_space"
                    return-object
                    dense
                    required
                    :rules="[rules.required]"
          >
          </v-select>
        </div>
        <div>
          <v-select :items="lands"
                    label="Далани танлаш"
                    outlined
                    dense
                    v-model="selected_land"
                    :item-text="(land) => `${land.properties.gis_area.toFixed(2)} ga`"
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
              :disabled="!(selected_land && plant_type && row_space)"
              @click="$store.dispatch('get_tech_card', {selected_land, plant_type})"
          >Тех. картани яратиш
          </v-btn>
        </div>
        <template v-if="((selected_land && plant_type && row_space) && ( tech_card.phases.length > 0 && tech_card.phases[0].arrangements.length > 0))">

          <div>
            <v-btn
                :disabled="( tech_card.phases.length > 0 && tech_card.phases[0].arrangements.length > 0 && tech_card.phases[0].arrangements[0].copy) "
                color="success" @click="$store.dispatch('save_tech_card', {selected_land, plant_type})">
              Сақлаш
            </v-btn>
          </div>
          <div>
            <v-btn
                :disabled="!( tech_card.phases.length > 0 && tech_card.phases[0].arrangements.length > 0 && tech_card.phases[0].arrangements[0].copy) "
                color="secondary" @click="$store.dispatch('cancel_tech_card', {selected_land, plant_type})">
              Бекор қилиш
            </v-btn>
          </div>
        </template>

      </template>
    </div>

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
      deletingItem: null,
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