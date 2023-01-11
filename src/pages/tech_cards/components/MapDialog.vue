<template>
  <v-dialog
      v-model="dialog"
      width="1200"
      ref="mydialog" eager
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="secondary"
          x-large
          class="mr-4"
          v-bind="attrs"
          v-on="on"
      >Харитада кўриш
      </v-btn>

    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Харита
      </v-card-title>
      <v-card-text class="my-3" :height="200" >
        <h2 v-if="selected.feature && selected.feature.properties">
          Кадастр рақами : <span class="ml-5">{{selected.feature.properties.cadastral_number }}</span>
        </h2>
        <h2 v-if="selected.feature && selected.feature.properties">
          Ер майдони : <span class="ml-5">{{selected.feature.properties.gis_area }} га</span>
        </h2>
      </v-card-text>

      <v-card-text>
        <v-container fluid>

          <l-map
              ref="map"
              :options="options"
              :zoom="zoom"
              :center="center"
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

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="secondary"
            text
            @click="dialog = false"
        >
          Бекор қилиш
        </v-btn>
        <v-btn
            color="success"
            :disabled="!selected.feature"
            @click="selectLand"
        >
          Tasdiqlash
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {LMap, LTileLayer, LControlLayers, LControlZoom} from 'vue2-leaflet';
import L from 'leaflet';
import $ from "jquery";

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
    }
  },
  methods: {
    selectLand() {
      this.$store.commit('land', this.selected.feature)
      this.dialog = false;
    },
    clickToFeature(feature, layer) {
      for (let geojson of this.geoJSONs) {
        geojson.setStyle({
          fillColor: '#0088ff',
        })
      }
      if (this.selected.feature == feature) {
        layer.setStyle({
          fillColor: '#0088ff',
        });
        this.selected = {};
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
  },
  watch: {
    lands() {
      var This = this
      var map = this.$refs.map.mapObject
      map.eachLayer(function (layer) {
        if (layer.myTag && layer.myTag === "myGeoJSON") {
          map.removeLayer(layer)
        }
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
            onEachFeature: function (feature, layer) {
              layer.on('mouseover', function () {
                this.setStyle({
                  color: "white"
                })
              });
              layer.on('mouseout', function () {
                this.setStyle({
                  color: "black"
                })
              });
              layer.on('click', function () {
                This.clickToFeature(feature, layer)
              });
              layer.myTag = "myGeoJSON"
            },
          };
      let geoJSON = []
      for (var land in this.lands) {
        geoJSON = L.geoJSON(this.lands[land], options).addTo(this.$refs.map.mapObject).bringToFront()
        this.geoJSONs.push(geoJSON)
        if(land == this.lands.length)
        this.$refs.map.mapObject.fitBounds(geoJSON.getBounds(), {padding: [50, 50]})
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
  height: 400px;
}
</style>