import axios from 'axios'

const state = {
    regions: [],
    regions_loading: false,
    deleteRegionDialog: false,
    creatingRegionDialog: false,
    editRegionDialog: false,
}

const getters = {
    regions: state => state.regions,
    regions_loading: state => state.regions_loading,
    deleteRegionDialog: state => state.deleteRegionDialog,
    creatingRegionDialog: state => state.creatingRegionDialog,
    editRegionDialog: state => state.editRegionDialog,
}

const actions = {
    getRegions({commit}, params) {
        commit('regions_loading', true)
        axios.get('/get_all_regions', {params})
            .then(response => {
                commit('set_regions', response.data)
                commit('regions_loading', false)
            })
            .catch(error => {
                commit('regions_loading', false)
                console.log(error)
            })
    },
    storeRegion({commit, dispatch}, params) {
        commit('regions_loading', true)
        var data = new FormData()
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('region_code', params.region_code)

        axios.post('/add_region', data)
            .then(() => {
                dispatch('getRegions')
                commit('regions_loading', false)
                commit('creatingRegionDialog', false)
            })
            .catch(error => {
                commit('regions_loading', false)
                console.log(error)
            })
    },
    updateRegion({commit, dispatch}, params) {
        commit('regions_loading', true)
        var data = new FormData()
        data.append('id', params.id)
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('region_code', params.region_code)

        axios.post('/update_region', data)
            .then(() => {
                dispatch('getRegions')
                commit('regions_loading', false)
                commit('editRegionDialog', false)
            })
            .catch(error => {
                commit('regions_loading', false)
                console.log(error)

            })
    },

    deleteRegion({commit, dispatch}, params) {
        commit('regions_loading', true)
        axios.get('/delete_region', {params: {id: params.id}})
            .then(() => {
                dispatch('getRegions')
                commit('regions_loading', false)
                commit('deleteRegionDialog', false)
            })
            .catch(error => {
                commit('regions_loading', false)
                console.log(error)
            })
    }
}

const mutations = {
    set_regions: (state, regions) => (state.regions = regions),
    regions_loading: (state, loading) => (state.regions_loading = loading),
    deleteRegionDialog: (state, dialog) => (state.deleteRegionDialog = dialog),
    creatingRegionDialog: (state, dialog) => (state.creatingRegionDialog = dialog),
    editRegionDialog: (state, dialog) => (state.editRegionDialog = dialog),
}

export default {
    state,
    getters,
    actions,
    mutations
}