import axios from 'axios'

const state = {
    gis_bridge_lands: [],
    gis_bridge_lands_loading: false,
    tech_card: {
        parameters: [],
        phases: [],
    },
    tech_card_shablon : {
        parameters: [],
        phases: [],
    },
    tech_card_loading: false,
    land: 0,
    plant_type: {},
    is_changed_map: false,
    delete_tech_card_dialog: false,
    add_tech_card_dialog: false,
    edit_tech_card_dialog: false,
    delete_group_dialog: false,
    tech_card_arrangements: [],
    phase: 0,
    index: 0,
    edit_item: {},
    row_space: 0,
    group_index: 0,
    tech_card_exists: false,
    land_dialog: false
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
    row_space: state => state.row_space,
    delete_group_dialog: state => state.delete_group_dialog,
    group_index: state => state.group_index,
    tech_card_exists: state => state.tech_card_exists,
    land_dialog: state => state.land_dialog,
    tech_card_shablon: state => state.tech_card_shablon,
}

const actions = {
    get_gis_bridge_lands({commit}, params) {
        commit('gis_bridge_lands', [])
        commit('gis_bridge_lands_loading', true)
        commit('is_changed_map', false)
        axios.get(`https://api.agro.uz/gis_bridge/tech-map`, {
            headers: {
                'Authorization': "Token 140d96f6c234d5ea7838aa43729b21fe97a6"
            },
            params
        })
            .then(response => {
                var lands = []
                if(response.data.length)
                for(var land of response.data[0].features)
                {
                    var item = land
                    axios.get(`https://api.agro.uz/gis_bridge/get_contour`, {
                        headers: {
                            'Authorization': "Token 140d96f6c234d5ea7838aa43729b21fe97a6"
                        },
                        params: {cad: item.properties.cadastral_number}
                    })
                        .then(res => {
                            item.properties.contour_number = res.data.features[0].properties.contour_number
                            item.properties.massiv_name = res.data.features[0].properties.massiv_name
                            commit('gis_bridge_lands_loading', false)
                            axios.get('/geojson', {
                                params: {contour_num: item.properties.contour_number}
                            })
                                .then(r => {
                                    item.parts = r.data
                                    for(var part of item.parts)
                                    {
                                        part.properties.cadastral_number = land.properties.cadastral_number
                                        part.properties.district_code = land.properties.soato_code
                                        part.properties.id = part.id
                                    }
                                    commit('gis_bridge_lands_loading', false)
                                    lands.push(item)
                                    commit('is_changed_map', true)
                                    commit('gis_bridge_lands', lands)
                                    commit('gis_bridge_lands_loading', false)
                                })
                        })

                }
            })
            .catch(error => {
                commit('gis_bridge_lands_loading', false)
                console.log(error)
            })
    },
    check_tech_card({commit},params){
        axios.get(`/check_tech_card`, {params})
            .then(response => {
                var data = response.data
                if(data.plant_id)
                {
                    commit('plant_type', {id: data.plant_id})
                    commit('row_space', data.row_space)
                    commit('tech_card_exists', true)
                }else{
                    commit('plant_type', {} )
                    commit('row_space', null)
                    commit('tech_card_exists', false)

                }
                commit('gis_bridge_lands_loading', false)
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    get_tech_card_shablon({commit}, {selected_land, plant_type}) {
        commit('gis_bridge_lands_loading', true)
        commit('land', selected_land)
        commit('plant_type', plant_type)
        var params = {
            ekin_type_id: plant_type.id,
            gis_area: selected_land.properties.crop_area,
            cadastor: selected_land.properties.cadastral_number,
            district_code: selected_land.properties.district,
            contour_number:  selected_land.properties.kontur_raqami + "/" + selected_land.id
        }

        axios.get(`/tech_card`, {params})
            .then(response => {
                commit('tech_card_shablon', response.data)

                commit('gis_bridge_lands_loading', false)
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },

    get_tech_card({commit, dispatch}, {selected_land, plant_type}) {
        commit('gis_bridge_lands_loading', true)
        commit('land', selected_land)
        commit('plant_type', plant_type)
        var params = {
            ekin_type_id: plant_type.id,
            gis_area: selected_land.properties.crop_area,
            cadastor: selected_land.properties.cadastral_number,
            district_code: selected_land.properties.district,
            contour_number:  selected_land.properties.kontur_raqami + "/" + selected_land.id
        }
        dispatch('get_tech_card_shablon',{selected_land, plant_type})
        axios.get(`/tech_card_copy`, {params})
            .then(response => {
                commit('tech_card', response.data)
                commit('gis_bridge_lands_loading', false)
                commit('land_dialog', false)
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
            commit('land_dialog', false)
        })
    },
    save_tech_card({commit, dispatch}, {selected_land, plant_type}) {
        commit('gis_bridge_lands_loading', true)
        commit('land', selected_land)
        commit('plant_type', plant_type)
        var data = new FormData()
        data.append('ekin_type_id', plant_type.id)
        data.append('gis_area', selected_land.properties.crop_area)
        data.append('cadastor', selected_land.properties.cadastral_number)
        data.append('district_code', selected_land.properties.district)
        data.append('contour_number', selected_land.properties.kontur_raqami + "/" + selected_land.id )

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
                commit('tech_card',{
                    parameters: [],
                    phases: [],
                })
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    delete_tech_card({commit}, {id}) {
        var params = {
            id
        }
        axios.get(`/delete_arr_copy`, {params})
            .then(() => {
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })
    },
    get_tech_card_arrangements({commit},) {
        commit('gis_bridge_lands_loading', true)
        axios.get(`/add_copy`, {params: {ekin_type_id: state.plant_type.id, phase_id: state.phase}})
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

    add_tech_card_arrangement({commit, dispatch}, {item, group_index}) {
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
        data.append("row_space", state.row_space);
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
        data.append("group_index",group_index);

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
        data.append("row_space", state.row_space);
        data.append("shift_continuity", item.shift_continuity);
        data.append("phase_id", state.phase);
        data.append("smenalik_koeffitsiyenti", item.smenalik_koeffitsiyenti);
        data.append("worker", item.worker);
        data.append("agregat", item.agregat);
        data.append("bir_birlika", item.bir_birlika);
        data.append("spec_formula", item.spec_formula);
        data.append("cadastor", state.land.properties.cadastral_number);
        data.append("gis_area", state.land.properties.gis_area);
        data.append("group_index", state.group_index);
        data.append("arrangement_id", item.arrangement_id);
        data.append("id", tech_card_id);

        axios.post("/edit_arr_copy", data)
            .then(() => {
                commit('edit_tech_card_dialog', false)
                dispatch('get_tech_card', {selected_land: state.land, plant_type: state.plant_type})
            }).catch(error => {
            console.log(error);
            commit('gis_bridge_lands_loading', false)
        })

    },
    delete_group({commit, dispatch}, {group_index, phase_id}) {
        var data = new FormData()
        data.append("phase_id", phase_id);
        data.append("group_index", group_index);
        data.append("cadastor",state.land.properties.cadastral_number );
        axios.post("/delete_by_group", data)
            .then(() => {
                commit('delete_group_dialog', false)
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
    row_space: (state, row_space) => (state.row_space = row_space),
    delete_group_dialog: (state, delete_group_dialog) => (state.delete_group_dialog = delete_group_dialog),
    group_index: (state, group_index) => (state.group_index = group_index),
    tech_card_exists: (state, tech_card_exists) => (state.tech_card_exists = tech_card_exists),
    land_dialog: (state, land_dialog) => (state.land_dialog = land_dialog),
    tech_card_shablon: (state, tech_card_shablon) => (state.tech_card_shablon = tech_card_shablon),
}

export default {
    state,
    getters,
    actions,
    mutations
}