import Vue from 'vue'
import Vuex from 'vuex'
import regions from './regions'
import districts from "@/store/districts";
import mfies from "@/store/mfies";
import arrangements from "@/store/arrangements";
import plant_types from "@/store/plant_types";
import gis_bridge from "@/store/gis_bridge";
import agronom from "@/store/agronom";

Vue.use(Vuex)


const store = new Vuex.Store({
    modules: {
        regions,
        districts,
        mfies,
        arrangements,
        plant_types,
        gis_bridge,
        agronom
    },
    state:{
        title: 'Regions',
    },
    getters: {
        title: state => state.title,
    },
    mutations: {
        setTitle(state, title) {
            state.title = title
        }
    }
})


export default store