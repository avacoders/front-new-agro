import axios from 'axios'

const state = {
    arrangements: [],
    all_arrangements: [],
    arrangements_loading: false,
    deleteArrangementDialog: false,
    creatingArrangementDialog: false,
    editArrangementDialog: false,
}

const getters = {
    arrangements: state => state.arrangements,
    arrangements_loading: state => state.arrangements_loading,
    deleteArrangementDialog: state => state.deleteArrangementDialog,
    creatingArrangementDialog: state => state.creatingArrangementDialog,
    editArrangementDialog: state => state.editArrangementDialog,
    all_arrangements: state => state.all_arrangements,
}

const actions = {
    getArrangements({commit}, params) {
        commit('arrangements_loading', true)
        axios.get('/get_all_arrangements', {params})
            .then(response => {
                commit('set_arrangements', response.data)
                commit('arrangements_loading', false)
            })
            .catch(error => {
                commit('arrangements_loading', false)
                console.log(error)
            })
    },
    storeArrangement({commit, dispatch}, params) {
        commit('arrangements_loading', true)
        var data = new FormData()
        data.append('name', params.name)
        data.append('phase', params.phase)
        data.append('index', params.index)
        data.append('plant_id', params.plant_id)
        data.append('key', "field_area")
        data.append('value', "10 * 0.95 * FIELD_AREA")

        axios.post('/add_arrangement', data)
            .then(() => {
                dispatch('getArrangements')
                commit('arrangements_loading', false)
                commit('creatingArrangementDialog', false)
            })
            .catch(error => {
                commit('arrangements_loading', false)
                console.log(error)
            })
    },
    updateArrangement({commit, dispatch}, params) {
        commit('arrangements_loading', true)
        var data = new FormData()
        data.append('id', params.id)
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('arrangement_code', params.arrangement_code)
        data.append('region_code', params.region ? params.region.region_code : null)
        axios.post('/update_arrangement', data)
            .then(() => {
                commit('arrangements_loading', false)
                commit('editArrangementDialog', false)
                dispatch('getArrangements')
            })
            .catch(error => {
                commit('arrangements_loading', false)
                console.log(error)
            })
    },

    deleteArrangement({commit, dispatch}, params) {
        commit('arrangements_loading', true)
        axios.get('/delete_arrangement', {params: {id: params.id}})
            .then(() => {
                dispatch('getArrangements')
                commit('arrangements_loading', false)
                commit('deleteArrangementDialog', false)
            })
            .catch(error => {
                commit('arrangements_loading', false)
                console.log(error)
            })
    }
}

const mutations = {
    set_all_arrangements: (state, all_arrangements) => (state.all_arrangements = all_arrangements),
    set_arrangements: (state, arrangements) => (state.arrangements = arrangements),
    arrangements_loading: (state, loading) => (state.arrangements_loading = loading),
    deleteArrangementDialog: (state, dialog) => (state.deleteArrangementDialog = dialog),
    creatingArrangementDialog: (state, dialog) => (state.creatingArrangementDialog = dialog),
    editArrangementDialog: (state, dialog) => (state.editArrangementDialog = dialog),
}

export default {
    state,
    getters,
    actions,
    mutations
}