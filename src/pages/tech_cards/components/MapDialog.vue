<template>
  <v-card class="mapCorner">
    <!--    <v-card-text class="mt-3" :height="200">-->
    <!--      <h2>-->
    <!--        Кадастр рақами : <span  v-if="selected.feature && selected.feature.properties && selected.feature.properties.cadastral_number" class="ml-5">{{ selected.feature.properties.cadastral_number }}</span>-->
    <!--      </h2>-->
    <!--      <h2 >-->
    <!--        Ер майдони :  <span v-if="selected.feature && selected.feature.properties && selected.feature.properties.gis_area" class="ml-5">{{ selected.feature.properties.gis_area.toFixed(2) }} га</span>-->
    <!--      </h2>-->
    <!--    </v-card-text>-->

    <v-card-text class="my-2">
      <v-container fluid style="padding: 0">

        <l-map
            ref="map"
            :options="options"
            :zoom="zoom"
            :center="center"
            style="z-index: 1"
            v-bind:style="{cursor: 'pointer'}"
            height="60vh"
            class="mapCorner">
          <l-control-layers position="topright"></l-control-layers>


          <l-tile-layer
              v-for="tileProvider in tileProviders"
              :key="tileProvider.name"
              :name="tileProvider.name"
              :visible="tileProvider.visible"
              :url="tileProvider.url"
              :attribution="tileProvider.attribution"
              :max-zoom="tileProvider.maxZoom"
              :subdomains="tileProvider.subdomains"
              layer-type="base"/>

          <l-control-zoom position="bottomright"></l-control-zoom>
        </l-map>

      </v-container>
    </v-card-text>
    <div class="text-center">
      <v-dialog
          v-model="dialog"
          width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Дала ҳақида маълумотлар
          </v-card-title>
          <v-card-text class="py-3" v-if="land && land.properties">
            <p><b>Контур рақами: </b>{{ land.properties.kontur_raqami }}</p>
            <p><b>Экин тури: </b>{{ land.properties.crop_name }}</p>
            <p><b>Экин майдони: </b> {{ land.properties.crop_area.toFixed(2) }} га</p>
            <template v-if="!tech_card_exists">

              <v-alert
                  dense
                  type="error"
              >Ушбу майдонга технологик карта яратилмаган
              </v-alert>
              <v-row>
                <v-col cols="12">
                  <v-select :items="plant_types"
                            label="Экин тури"
                            outlined
                            dense
                            v-model="plant_type"
                            :item-text="(plant) => plant.name_uz"
                            return-object
                            required
                            hide-details
                            :item-value="(plant) => plant.id"
                            :rules="[rules.required]"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12">

                  <v-select :items="row_spaces"
                            label="Қатор оралиғи"
                            outlined
                            hide-details
                            v-model="row_space"
                            return-object
                            dense
                            required
                            :rules="[rules.required]"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-alert
                  dense
                  type="success"
              >Ушбу майдон учун технологик карта мавжуд
              </v-alert>
              <template v-if="plant_type && plant_type.id">
                <p><b>Технологик картадаги экин тури: </b>{{ plant_types.find((e) => e.id === plant_type.id).name_uz }}
                </p>
              </template>
              <p><b>Технологик картадаги қатор оралиғи: </b> {{ row_space }} га</p>
            </template>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="secondary"
                text
                @click="dialog = false"
            >
              Ëпиш
            </v-btn>
            <template v-if="!tech_card_exists">

              <v-btn
                  color="success"
                  text
                  @click="save"
                  :disabled="plant_type === null || row_space === null || loading"
                  :loading="loading"
              >
                Тех. картани яратиш
              </v-btn>
            </template>
            <template v-else>
              <v-btn
                  color="primary"
                  text
                  @click="get"
                  :disabled="loading"
                  :loading="loading"
              >
                Тех. картани кўриш
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<script>
import {LMap, LTileLayer, LControlLayers, LControlZoom} from 'vue2-leaflet';
import L from 'leaflet';
import $ from 'jquery'

export default {
  name: "MapDialog",

  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LControlZoom,
  },
  data() {
    return {
      row_spaces: [
        45, 60, 90
      ],
      rules: {
        required: value => !!value || "Required.",
        max: v => v.length <= 255 || "Max 20 characters",
      },
      options: {
        zoomControl: false,
      },
      selected: {},
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
          '&copy; <a target="_blank" href="http://agro.uz">OpenStreetMap</a> contributors',
      zoom: 6,
      center: [41.66655, 66.3235],
      maxZoom: 20,
      markerLatLng: [41.66655, 66.3235],
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      colors: [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#00ffff',
        '#ff00ff',
        '#000000',
        '#ffffff',
        '#800000',
        '#808000',
        '#008000',
        '#800080',
        '#008080',
        '#000080',
        '#808080',
        '#c0c0c0',
      ],

      tileProviders: [
        {
          name: 'Satellite',
          visible: false,
          attribution:
              '<a target="_blank" href="http://www.agro.uz"> www.agro.uz &copy; AgroDigital</a>',
          url: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        },
        {
          name: 'Hybrid',
          visible: true,

          url: 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          attribution:
              'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        },
        {
          name: 'Street',
          visible: false,
          url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          attribution:
              'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],

        },
      ],
      geoJSONs: [],

    };
  },
  props: {
    lands: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    save() {
      this.$store.dispatch('save_tech_card', {selected_land: this.land, plant_type: this.plant_type})
      this.dialog = true
    },
    get() {
      this.$store.dispatch('get_tech_card', {selected_land: this.land, plant_type: this.plant_type})

    },
    draw() {
      var This = this
      var map = this.$refs.map.mapObject
      map.eachLayer(function (layer) {

        if (layer && typeof layer.setStyle == 'function') {
          layer.setStyle({
            fillColor: '#0088ff',
          })
          if (layer.myTag && layer.myTag === "myGeoJSON") {
            map.removeLayer(layer)
          }

        }
      });
      var geojsonStyle = {
        fillColor: "#0088ff",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
      };

      var i = 0
      for (var land in this.lands) {
        if (this.lands[land].parts)
          for (var part in this.lands[land].parts) {
            if (this.lands[land].parts[part]) {
              geojsonStyle.fillColor = This.colors[i]
              var geoJSON = new L.geoJSON(this.lands[land].parts[part], {
                maxZoom: 20,
                tolerance: 3,
                debug: 0,
                style: geojsonStyle,
                onEachFeature: function (feature, layer) {
                  L.marker(layer.getBounds().getCenter(), {
                    icon: L.divIcon({
                      className: 'label',
                      html: `<div style="transform: translateX(50%); color:white; font-size: 12px; position: absolute; right: 50%">${feature.properties.crop_name}</div>`,
                      iconSize: [100, 40]
                    })
                  }).addTo(map);
                  layer.on('mouseover', function () {
                    layer.setStyle({
                      color: "white",
                    })
                  });
                  layer.on('mouseout', function () {
                    layer.setStyle({
                      color: This.selected.feature == feature ? '#55ff00' : "black"
                    })
                  });
                  layer.on('click', function () {
                    This.clickToFeature(feature, layer)
                  });
                  i++
                  // layer.myTag = "myGeoJSON"
                }

              }).addTo(this.$refs.map.mapObject).bringToFront()
              this.geoJSONs.push(geoJSON)
              this.$refs.map.mapObject.fitBounds(geoJSON.getBounds(), {padding: [50, 50]})
            }
          }
      }
      this.is_changed_map = !this.is_changed_map
    },
    clickToFeature(feature, layer) {
      this.dialog = true
      var map = this.$refs.map.mapObject
      map.eachLayer(function (l) {
        if (typeof l.setStyle === 'function')
          l.setStyle({
            color: 'white',
            weight: 1,
          });
      });
      this.$store.commit('land', feature)
      if (this.selected.feature == feature) {
        layer.setStyle({
          color: 'white',
          weight: 1,
        });
      } else {
        this.selected = {feature, layer};
        layer.setStyle({
          color: '#55ff00',
          weight: 4,
        });
      }
    },
  },
  mounted() {
    $('.leaflet-control-attribution').hide()
    this.draw()
    this.$store.dispatch('getAllPlantTypes')
  },
  computed: {
    loading: {
      get() {
        return this.$store.getters.gis_bridge_lands_loading
      },
      set(value) {
        this.$store.commit('gis_bridge_lands_loading', value)
      }
    },
    dialog: {
      get() {
        return this.$store.getters.land_dialog
      },
      set(value) {
        this.$store.commit('land_dialog', value)
      }
    },
    plant_type: {
      get() {
        return this.$store.getters.plant_type;
      },
      set(value) {
        this.$store.commit('plant_type', value);
      }
    },
    tech_card_exists() {
      return this.$store.getters.tech_card_exists
    },
    plant_types: {
      get() {
        return this.$store.getters.all_plant_types;
      },
      set(value) {
        this.$store.commit('set_all_plant_types', value);
      }
    },
    land() {
      return this.$store.getters.land
    },
    row_space: {
      get() {
        return this.$store.getters.row_space
      },
      set(value) {
        this.$store.commit('row_space', value)
      }
    },
    is_changed_map: {
      get() {
        return this.$store.getters.is_changed_map
      },
      set(value) {
        this.$store.commit('is_changed_map', value)
      }
    },
  },
  watch: {
    lands() {
      this.draw()
    },
    dialog(val) {
      if (val)
        this.$store.dispatch('check_tech_card', {
          cad_number: this.land.properties.cadastral_number,
          contour_number: this.land.properties.kontur_raqami + "/" + this.land.id
        })
    },
    is_changed_map(val) {
      if (val) {
        this.draw()
      }
    }
  }
}
</script>

<style scoped>
.leaflet-control-attribution {
  display: none !important;
}

.vue2leaflet-map {
  height: 60vh;
}

.mapCorner {
  border-radius: 12px;
}


.fade .modal-content {
  transform: scale(0);
  opacity: 0;
  transition: all .3s ease-out;
}

.fade.show .modal-content {
  opacity: 1;
  transform: scale(1);
}

.leaflet-marker-icon {
  color: white;
  font-size: 16px;

}
</style>