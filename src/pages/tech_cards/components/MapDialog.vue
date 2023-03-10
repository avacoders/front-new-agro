<template>
  <v-card class="mapCorner">
    <v-card-text class="mt-3" :height="200">
      <h2>
        Кадастр рақами : <span  v-if="selected.feature && selected.feature.properties && selected.feature.properties.cadastral_number" class="ml-5">{{ selected.feature.properties.cadastral_number }}</span>
      </h2>
      <h2 >
        Ер майдони :  <span v-if="selected.feature && selected.feature.properties && selected.feature.properties.gis_area" class="ml-5">{{ selected.feature.properties.gis_area.toFixed(2) }} га</span>
      </h2>
    </v-card-text>

    <v-card-text>
      <v-container fluid style="padding: 0">

        <l-map
            ref="map"
            :options="options"
            :zoom="zoom"
            :center="center"
            style="z-index: 1"
            v-bind:style="{cursor: 'pointer'}"
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
            <p><b>Экин тури: </b>{{ ekin_names['e' + land.properties.crop_name] }}</p>
            <p><b>Экин майдони: </b> {{ land.properties.crop_area.toFixed(2) }} га</p>

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
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="dialog = false"
            >
              Ëпиш
            </v-btn>
            <v-btn
                color="primary"
                text
                @click="save"
            >
              Тех. картани яратиш
            </v-btn>
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
      plant_type: null,
      ekin_names: {
        e104070000: "Карам",
        e104040000: "Пиёз",
        e104050000: "Саримсоқпиёз",
        e104060000: "Порей пиёзи",
        e104090000: "Кўкатлар",
        e104100000: "Редиска",
        e104110000: "Қалампир",
        e107010000: "Картошка",
        e109000000: "Мевали дарахтлар",
        e102000000: "Буғдой",
        e101010000: "Ғўза",
        e108000000: "Ozuqa ekin",
        e190000000: "Boshqa ekinlar",
        e105000000: "Полиз",
        e108040000: "Макка",
      },
      rules: {
        required: value => !!value || "Required.",
        max: v => v.length <= 255 || "Max 20 characters",
      },
      dialog: false,
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
    save(){
      this.$store.dispatch('get_tech_card', {selected_land: this.land, plant_type: this.plant_type})
      this.dialog = true
    },
    draw() {
      var This = this
      var map = this.$refs.map.mapObject
      map.eachLayer(function (layer) {
        if (layer.myTag && layer.myTag === "myGeoJSON") {
          map.removeLayer(layer)
        }
        layer.setStyle({
          fillColor: '#0088ff',
        });
      });
      var geojsonStyle = {
        fillColor: "#0088ff",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
      };

      var options =
          {
            maxZoom: 20,
            tolerance: 3,
            debug: 0,
            style: geojsonStyle,
            onEachFeature(feature, layer) {

              L.marker(layer.getBounds().getCenter(), {
                icon: L.divIcon({
                  className: 'label',
                  html: `<div style="transform: translateX(50%); color:white; font-size: 12px; position: absolute; right: 50%">${This.ekin_names['e' + feature.properties.crop_name]}</div>`,
                  iconSize: [100, 40]
                })
              }).addTo(map);
              layer.on('mouseover', function () {
                layer.setStyle({
                  color: "white"
                })
              });
              layer.on('mouseout', function () {
                layer.setStyle({
                  color: "black"
                })
              });
              layer.on('click', function () {

                This.clickToFeature(feature, layer)
              });
              layer.myTag = "myGeoJSON"
            },
          };
      for (var land of this.lands) {
        if(land.parts)
        for(var part of land.parts) {
          var geoJSON = L.geoJSON(part, options).addTo(this.$refs.map.mapObject).bringToFront()
          this.geoJSONs.push(geoJSON)
          this.$refs.map.mapObject.fitBounds(geoJSON.getBounds(), {padding: [50, 50]})
        }
      }
      this.is_changed_map = false
    },
    clickToFeature(feature, layer) {
      this.dialog = true
      var map = this.$refs.map.mapObject
      map.eachLayer(function (l) {
        if (typeof l.setStyle === 'function')
          l.setStyle({
          fillColor: '#0088ff',
        });
      });
      this.$store.commit('land', feature)
      if (this.selected.feature == feature) {
        layer.setStyle({
          fillColor: '#0088ff',
        });
      } else {
        this.selected = {feature, layer};
        layer.setStyle({
          fillColor: '#55ff00',
        });
      }

    },
  },
  mounted() {
    $('.leaflet-control-attribution').hide()
    this.draw()
  },
  computed: {
    plant_types: {
      get() {
        return this.$store.getters.all_plant_types;
      },
      set(value) {
        this.$store.commit('set_all_plant_types', value);
      }
    },
    land(){
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
    is_changed_map(val) {
      if(val){
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
.mapCorner{
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
.leaflet-marker-icon{
  color: white;
  font-size: 16px;

}
</style>