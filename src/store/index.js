import Vue from 'vue'
import Vuex from 'vuex'
import regions from './regions'
import districts from "@/store/districts";

Vue.use(Vuex)


const store = new Vuex.Store({
    modules: {
        regions,
        districts
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