import axios from 'axios'

const state = {
    gis_bridge_lands: [],
    gis_bridge_lands_loading: false,
    tech_card: [],
    tech_card_loading: false,
    land: 0,
    plant_type: {},
    is_changed_map: false,
    delete_tech_card_dialog: false,
    add_tech_card_dialog: false,
    edit_tech_card_dialog: false,
    tech_card_arrangements: [],
    phase: 0,
    index: 0,
    edit_item: {}
}

const getters = {
    gis_bridge_lands: state => state.gis_bridge_lands,
    gis_bridge_lands_loading: state => state.gis_bridge_lands_loading,
    tech_card: state => state.tech_card,
    tech_card_loading: state => state.tech_card_loading,
    land: state => state.land,
    plant_type: state => state.plant_type,
    is_changed_map: state => state.is_changed_map,
    delete_tech_card_dialog: state => state.delete_tech_card_dialog,
    add_tech_card_dialog: state => state.add_tech_card_dialog,
    edit_tech_card_dialog: state => state.edit_tech_card_dialog,
    tech_card_arrangements: state => state.tech_card_arrangements,
    phase: state => state.phase,
    index: state => state.index,
    edit_item: state => state.edit_item,
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
            cadastor: selected_land.properties.cadastral_number,
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
    save_tech_card({commit, dispatch}, {selected_land, plant_type}) {
        commit('gis_bridge_lands_loading', true)
        commit('land', selected_land)
        commit('plant_type', plant_type)
        var data = new FormData()
        data.append('ekin_type_id', plant_type.id)
        data.append('gis_area', selected_land.properties.gis_area)
        data.append('cadastor', selected_land.properties.cadastral_number)
        axios.post(`/save_tech_card`, data)
            .then(() => {
                commit('gis_bridge_lands_loading', false)
                dispatch('get_tech_card', {selected_land: state.land, plant_type: state.plant_type})

            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    cancel_tech_card({commit}, {selected_land, plant_type}) {
        commit('gis_bridge_lands_loading', true)
        commit('land', selected_land)
        commit('plant_type', plant_type)
        var params = {
            cadastor: selected_land.properties.cadastral_number,
            ekin_type_id: plant_type.id,
        }
        axios.get(`/delete_all_copies`, {params})
            .then(() => {
                commit('gis_bridge_lands_loading', false)
                commit('tech_card', [])
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    delete_tech_card({commit, dispatch}, {id}) {
        commit('gis_bridge_lands_loading', true)
        var params = {
            id
        }
        axios.get(`/delete_arr_copy`, {params})
            .then(() => {
                commit('gis_bridge_lands_loading', false)
                commit('delete_tech_card_dialog', false)
                dispatch('get_tech_card', {selected_land: state.land, plant_type: state.plant_type})
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    get_tech_card_arrangements({commit},) {
        commit('gis_bridge_lands_loading', true)
        axios.get(`/add_copy`, {params: {ekin_type_id: state.plant_type.id}})
            .then((result) => {
                commit('gis_bridge_lands_loading', false)
                commit('tech_card_arrangements', result.data)
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    get_tech_card_arrangement_by_id({commit}, {id}) {
        commit('gis_bridge_lands_loading', true)
        axios.get(`/get_copy`, {params: {id}})
            .then((result) => {
                commit('gis_bridge_lands_loading', false)
                commit('tech_card_arrangements', result.data)
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },

    add_tech_card_arrangement({commit, dispatch}, {item}) {
        var data = new FormData()
        data.append("start_time", item.start_time);
        data.append("end_time", item.end_time);
        data.append("name", item.name);
        data.append("number_of_days", item.number_of_days);
        data.append("index", state.index);
        data.append("plant_id", state.plant_type.id);
        data.append("unit", item.unit);
        data.append("balance_norm", item.balance_norm);
        data.append("discharge", item.discharge);
        data.append("discharge_human", item.discharge_human);
        data.append("gektar_norma", item.gektar_norma);
        data.append("square_procent", item.square_procent);
        data.append("row_space", item.row_space);
        data.append("shift_continiyty", item.shift_continuity);
        data.append("phase_id", state.phase);
        data.append("smenalik_koeffitsiyenti", item.smenalik_koeffitsiyenti);
        data.append("worker", item.worker);
        data.append("agregat", item.agregat);
        data.append("bir_birlika", item.bir_birlika);
        data.append("spec_formula", item.spec_formula);
        data.append("cadastor", state.land.properties.cadastral_number);
        data.append("gis_area", state.land.properties.gis_area);
        data.append("arrangement_id", item.id);

        axios.post("/add_copy", data)
            .then(() => {
                commit('add_tech_card_dialog', false)
                dispatch('get_tech_card', {selected_land: state.land, plant_type: state.plant_type})
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    update_tech_card_arrangement({commit, dispatch}, {item, tech_card_id}) {
        var data = new FormData()
        data.append("start_time", item.start_time);
        data.append("end_time", item.end_time);
        data.append("name", item.name);
        data.append("number_of_days", item.number_of_days);
        data.append("index", state.index);
        data.append("plant_id", state.plant_type.id);
        data.append("unit", item.unit);
        data.append("balance_norm", item.balance_norm);
        data.append("discharge", item.discharge);
        data.append("discharge_human", item.discharge_human);
        data.append("gektar_norma", item.gektar_norma);
        data.append("square_procent", item.square_procent);
        data.append("row_space", item.row_space);
        data.append("shift_continuity", item.shift_continuity);
        data.append("phase_id", state.phase);
        data.append("smenalik_koeffitsiyenti", item.smenalik_koeffitsiyenti);
        data.append("worker", item.worker);
        data.append("agregat", item.agregat);
        data.append("bir_birlika", item.bir_birlika);
        data.append("spec_formula", item.spec_formula);
        data.append("cadastor", state.land.properties.cadastral_number);
        data.append("gis_area", state.land.properties.gis_area);
        data.append("arrangement_id", item.id);
        data.append("id", tech_card_id);

        axios.post("/edit_arr_copy", data)
            .then(() => {
                commit('edit_tech_card_dialog', false)
                dispatch('get_tech_card', {selected_land: state.land, plant_type: state.plant_type})
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })

    }


}


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

const mutations = {
    gis_bridge_lands: (state, gis_bridge_lands) => (state.gis_bridge_lands = gis_bridge_lands),
    gis_bridge_lands_loading: (state, loading) => (state.gis_bridge_lands_loading = loading),
    tech_card: (state, tech_card) => (state.tech_card = tech_card),
    tech_card_loading: (state, loading) => (state.tech_card_loading = loading),
    land: (state, land) => (state.land = land),
    plant_type: (state, plant_type) => (state.plant_type = plant_type),
    is_changed_map: (state, is_changed_map) => (state.is_changed_map = is_changed_map),
    delete_tech_card_dialog: (state, delete_tech_card_dialog) => (state.delete_tech_card_dialog = delete_tech_card_dialog),
    add_tech_card_dialog: (state, add_tech_card_dialog) => (state.add_tech_card_dialog = add_tech_card_dialog),
    edit_tech_card_dialog: (state, edit_tech_card_dialog) => (state.edit_tech_card_dialog = edit_tech_card_dialog),
    tech_card_arrangements: (state, tech_card_arrangements) => (state.tech_card_arrangements = tech_card_arrangements),
    phase: (state, phase) => (state.phase = phase),
    index: (state, index) => (state.index = index),
    edit_item: (state, edit_item) => (state.edit_item = edit_item),
}

export default {
    state,
    getters,
    actions,
    mutations
}