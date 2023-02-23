import axios from 'axios'

const state = {
    agronom_tech_card: {
        parameters: [],
        phases: [],
    },
    agronom_tech_card_loading: false,
    agronom_plant_type: {},
    agronom_district: {},
}

const getters = {
    agronom_tech_card: state => state.agronom_tech_card,
    agronom_tech_card_loading: state => state.agronom_tech_card_loading,
    agronom_plant_type: state => state.agronom_plant_type,
    agronom_district: state => state.agronom_district,
}

const actions = {
    generate_datetimes({commit}, params) {
        commit('tech_card_loading', true)
        var data = new FormData()
        data.append('district_code', state.agronom_district.district_code)
        data.append('plant_id', state.agronom_plant_type.id)
        axios.post("/generate_datetimes", data)
            .then(() => {
                commit('tech_card_loading', true)
                axios.get("/generate_datetimes", {params}).then(response => {
                    commit('agronom_tech_card', response.data)
                    commit('tech_card_loading', false)
                })
           })
            .catch(error => {
                commit('tech_card_loading', false)
                console.log(error)
                axios.get("/generate_datetimes", {params}).then(response => {
                    commit('agronom_tech_card', response.data)
                    commit('tech_card_loading', false)
                })
            })
    },
    saveTechCard({commit}, params) {
        commit('tech_card_loading', true)
        var data = new FormData()
        data.append('id', params.id)
        data.append('start_time', params.start_time)
        data.append('end_time', params.end_time)
        data.append('continuity', params.continuity)
        axios.post("/set_datetime", data)
            .then(() => {
                commit('tech_card_loading', false)

            })
            .catch(error => {
                commit('tech_card_loading', false)
                console.log(error)
            })
    }
}

const mutations = {
    agronom_tech_card: (state, agronom_tech_card) => (state.agronom_tech_card = agronom_tech_card),
    agronom_tech_card_loading: (state, loading) => (state.agronom_tech_card_loading = loading),
    agronom_plant_type: (state, agronom_plant_type) => (state.agronom_plant_type = agronom_plant_type),
    agronom_district: (state, agronom_district) => (state.agronom_district = agronom_district),
}

export default {
    state,
    getters,
    actions,
    mutations
}