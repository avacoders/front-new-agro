import axios from 'axios'

const state = {
    districts: [],
    districts_loading: false,
    deleteDistrictDialog: false,
    creatingDistrictDialog: false,
    editDistrictDialog: false,
}

const getters = {
    districts: state => state.districts,
    districts_loading: state => state.districts_loading,
    deleteDistrictDialog: state => state.deleteDistrictDialog,
    creatingDistrictDialog: state => state.creatingDistrictDialog,
    editDistrictDialog: state => state.editDistrictDialog,
}

const actions = {
    getDistricts({commit}, params) {
        commit('districts_loading', true)
        axios.get('/get_all_districts', {params})
            .then(response => {
                commit('set_districts', response.data)
                commit('districts_loading', false)
            })
            .catch(error => {
                commit('districts_loading', false)
                console.log(error)
            })
    },
    getDistrictsByRegionCode({commit}, params) {
        axios.get('/districts_by_code', {params})
            .then(response => {
                commit('set_districts', response.data)
                commit('districts_loading', false)
            })
            .catch(error => {
                commit('districts_loading', false)
                console.log(error)
            })
    },
    storeDistrict({commit, dispatch}, params) {
        commit('districts_loading', true)
        var data = new FormData()
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('district_code', params.district_code)
        data.append('region_code', params.region_code)

        axios.post('/add_district', data)
            .then(() => {
                dispatch('getDistricts')
                commit('districts_loading', false)
                commit('creatingDistrictDialog', false)
            })
            .catch(error => {
                commit('districts_loading', false)
                console.log(error)
            })
    },
    updateDistrict({commit, dispatch}, params) {
        commit('districts_loading', true)
        var data = new FormData()
        data.append('id', params.id)
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('district_code', params.district_code)
        data.append('region_code', params.region ? params.region.region_code : null)
        axios.post('/update_district', data)
            .then(() => {
                commit('districts_loading', false)
                commit('editDistrictDialog', false)
                dispatch('getDistricts')
            })
            .catch(error => {
                commit('districts_loading', false)
                console.log(error)
            })
    },

    deleteDistrict({commit, dispatch}, params) {
        commit('districts_loading', true)
        axios.get('/delete_district', {params: {id: params.id}})
            .then(() => {
                dispatch('getDistricts')
                commit('districts_loading', false)
                commit('deleteDistrictDialog', false)
            })
            .catch(error => {
                commit('districts_loading', false)
                console.log(error)
            })
    }
}

const mutations = {
    set_districts: (state, districts) => (state.districts = districts),
    districts_loading: (state, loading) => (state.districts_loading = loading),
    deleteDistrictDialog: (state, dialog) => (state.deleteDistrictDialog = dialog),
    creatingDistrictDialog: (state, dialog) => (state.creatingDistrictDialog = dialog),
    editDistrictDialog: (state, dialog) => (state.editDistrictDialog = dialog),
}

export default {
    state,
    getters,
    actions,
    mutations
}