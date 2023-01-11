import axios from 'axios'

const state = {
    mfies: [],
    mfies_loading: false,
    deleteMfyDialog: false,
    creatingMfyDialog: false,
    editMfyDialog: false,
}

const getters = {
    mfies: state => state.mfies,
    mfies_loading: state => state.mfies_loading,
    deleteMfyDialog: state => state.deleteMfyDialog,
    creatingMfyDialog: state => state.creatingMfyDialog,
    editMfyDialog: state => state.editMfyDialog,
}

const actions = {
    getMfies({commit}, params) {
        commit('mfies_loading', true)
        axios.get('/get_mfies', {params})
            .then(response => {
                commit('set_mfies', response.data)
                commit('mfies_loading', false)
            })
            .catch(error => {
                commit('mfies_loading', false)
                console.log(error)
            })
    },
    storeMfy({commit, dispatch}, params) {
        commit('mfies_loading', true)
        var data = new FormData()
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('region_code', params.region_code)

        axios.post('/add_mfy', data)
            .then(() => {
                dispatch('getMfys')
                commit('mfies_loading', false)
                commit('creatingMfyDialog', false)
            })
            .catch(error => {
                commit('mfies_loading', false)
                console.log(error)
            })
    },
    updateMfy({commit, dispatch}, params) {
        commit('mfies_loading', true)
        var data = new FormData()
        data.append('id', params.id)
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('mfy_code', params.mfy_code)

        axios.post('/update_mfy', data)
            .then(() => {
                dispatch('getMfys')
                commit('mfies_loading', false)
                commit('editMfyDialog', false)
            })
            .catch(error => {
                commit('mfies_loading', false)
                console.log(error)

            })
    },

    deleteMfy({commit, dispatch}, params) {
        commit('mfies_loading', true)
        axios.get('/delete_mfy', {params: {id: params.id}})
            .then(() => {
                dispatch('getMfys')
                commit('mfies_loading', false)
                commit('deleteMfyDialog', false)
            })
            .catch(error => {
                commit('mfies_loading', false)
                console.log(error)
            })
    }
}

const mutations = {
    set_mfies: (state, mfies) => (state.mfies = mfies),
    mfies_loading: (state, loading) => (state.mfies_loading = loading),
    deleteMfyDialog: (state, dialog) => (state.deleteMfyDialog = dialog),
    creatingMfyDialog: (state, dialog) => (state.creatingMfyDialog = dialog),
    editMfyDialog: (state, dialog) => (state.editMfyDialog = dialog),
}

export default {
    state,
    getters,
    actions,
    mutations
}