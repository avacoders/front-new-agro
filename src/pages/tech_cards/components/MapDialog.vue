<template>
  <v-card>
    <v-card-text class="my-3" :height="200">
      <h2>
        Кадастр рақами : <span  v-if="selected.feature && selected.feature.properties && selected.feature.properties.cadastral_number" class="ml-5">{{ selected.feature.properties.cadastral_number }}</span>
      </h2>
      <h2 >
        Ер майдони :  <span v-if="selected.feature && selected.feature.properties && selected.feature.properties.gis_area" class="ml-5">{{ selected.feature.properties.gis_area.toFixed(2) }} га</span>
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
  </v-card>
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
    },
  },
  methods: {
    selectLand() {
      this.$store.commit('land', this.selected.feature)
      this.dialog = false;
    },
    draw() {
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
            onEachFeature(feature, layer) {
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
      for (var land in this.lands) {
        var geoJSON = L.geoJSON(this.lands[land], options).addTo(this.$refs.map.mapObject).bringToFront()
        this.geoJSONs.push(geoJSON)
        this.$refs.map.mapObject.fitBounds(geoJSON.getBounds(), {padding: [50, 50]})
      }
      this.is_changed_map = false
    },
    clickToFeature(feature, layer) {
      if(this.$store.getters.land && this.$store.getters.land.properties && this.$store.getters.land.properties.cadastral_number === feature.properties.cadastral_number){
        this.$store.commit('land', 0)
      }else {
        this.$store.commit('land', feature)
      }

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
    this.draw()
  },
  computed: {
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
    land() {
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
</style>