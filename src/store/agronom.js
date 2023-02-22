import axios from 'axios'

const state = {
    agronom_tech_card: {
        parameters: [],
        phases: [],
    },
    agronom_tech_card_loading: false,
}

const getters = {
    agronom_tech_card: state => state.agronom_tech_card,
    agronom_tech_card_loading: state => state.agronom_tech_card_loading,
}

const actions = {
    generate_datetimes({commit}, params) {
        commit('tech_card_loading', true)
        var data = new FormData()
        data.append('district_code', params.district_code)
        data.append('plant_id', params.plant_id)
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
            })
    },
}

const mutations = {
    agronom_tech_card: (state, tech_card) => (state.tech_card = tech_card),
    agronom_tech_card_loading: (state, loading) => (state.tech_card_loading = loading),
}

export default {
    state,
    getters,
    actions,
    mutations
}