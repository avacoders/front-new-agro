import axios from 'axios'

const state = {
    gis_bridge_lands: [],
    gis_bridge_lands_loading: false,
    tech_card: [],
    tech_card_loading: false,
    land: 0,
    plant_type: {},
    is_changed_map : false,
}

const getters = {
    gis_bridge_lands: state => state.gis_bridge_lands,
    gis_bridge_lands_loading: state => state.gis_bridge_lands_loading,
    tech_card: state => state.tech_card,
    tech_card_loading: state => state.tech_card_loading,
    land: state => state.land,
    plant_type: state => state.plant_type,
    is_changed_map: state => state.is_changed_map,
}

const actions = {
    get_gis_bridge_lands({commit}, params) {
        commit('gis_bridge_lands_loading', true)
        axios.get(`https://api.agro.uz/gis_bridge/kadastr-by-taxnumber`, {
            headers: {
                'Authorization': "Token 140d96f6c234d5ea7838aa43729b21fe97a6"
            },
            params
        })
            .then(response => {
                commit('gis_bridge_lands', response.data[0].features)
                commit('gis_bridge_lands_loading', false)
                commit('is_changed_map', true)
            })
            .catch(error => {
                commit('gis_bridge_lands_loading', false)
                console.log(error)
            })
    },
    get_tech_card({commit}, {selected_land, plant_type}) {
        commit('gis_bridge_lands_loading', true)
        commit('land', selected_land)
        commit('plant_type', plant_type)
        var params = {
            ekin_type_id: plant_type.id,
            gis_area: selected_land.properties.gis_area,
        }
        axios.get(`/tech_card`, {params})
            .then(response => {
                commit('tech_card', response.data)
                commit('gis_bridge_lands_loading', false)
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    // delete_tech_card_element({commit}, ) {
    //     commit('gis_bridge_lands_loading', true)
    //     commit('land', selected_land)
    //     commit('plant_type', plant_type)
    //     var params = {
    //         ekin_type_id: plant_type.id,
    //         gis_area: selected_land.properties.gis_area,
    //     }
    //     axios.get(`/tech_card`, {params})
    //         .then(response => {
    //             commit('tech_card', response.data)
    //             commit('gis_bridge_lands_loading', false)
    //         }).catch(error => {
    //         console.log(error);
    //         commit('gis_bridge_lands_loading', false)
    //     })
    // }
}

const mutations = {
    gis_bridge_lands: (state, gis_bridge_lands) => (state.gis_bridge_lands = gis_bridge_lands),
    gis_bridge_lands_loading: (state, loading) => (state.gis_bridge_lands_loading = loading),
    tech_card: (state, tech_card) => (state.tech_card = tech_card),
    tech_card_loading: (state, loading) => (state.tech_card_loading = loading),
    land: (state, land) => (state.land = land),
    plant_type: (state, plant_type) => (state.plant_type = plant_type),
    is_changed_map: (state, is_changed_map) => (state.is_changed_map = is_changed_map),
}

export default {
    state,
    getters,
    actions,
    mutations
}