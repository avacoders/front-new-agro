import axios from 'axios'

const state = {
    plant_types: [],
    all_plant_types: [],
    plant_types_loading: false,
    deletePlantTypeDialog: false,
    creatingPlantTypeDialog: false,
    editPlantTypeDialog: false,
}

const getters = {
    plant_types: state => state.plant_types,
    plant_types_loading: state => state.plant_types_loading,
    deletePlantTypeDialog: state => state.deletePlantTypeDialog,
    creatingPlantTypeDialog: state => state.creatingPlantTypeDialog,
    editPlantTypeDialog: state => state.editPlantTypeDialog,
    all_plant_types: state => state.all_plant_types,
}

const actions = {
    getAllPlantTypes({commit}) {
        commit('plant_types_loading', true)
        axios.get('/add_arrangement')
            .then(response => {
                commit('set_all_plant_types', response.data)
                commit('plant_types_loading', false)
            })
            .catch(error => {
                commit('plant_types_loading', false)
                console.log(error)
            })
    },
    getPlantTypes({commit}, params) {
        commit('plant_types_loading', true)
        axios.get('/get_plant_types', {params})
            .then(response => {
                commit('set_plant_types', response.data)
                commit('plant_types_loading', false)
            })
            .catch(error => {
                commit('plant_types_loading', false)
                console.log(error)
            })
    },
    storerrangementA({commit, dispatch}, params) {
        commit('plant_types_loading', true)
        var data = new FormData()
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('arrangement_code', params.arrangement_code)
        data.append('region_code', params.region_code)

        axios.post('/add_arrangement', data)
            .then(() => {
                dispatch('getPlantTypes')
                commit('plant_types_loading', false)
                commit('creatingPlantTypeDialog', false)
            })
            .catch(error => {
                commit('plant_types_loading', false)
                console.log(error)
            })
    },
    updatePlantType({commit, dispatch}, params) {
        commit('plant_types_loading', true)
        var data = new FormData()
        data.append('id', params.id)
        data.append('name_uz', params.name_uz)
        data.append('name_ru', params.name_ru)
        data.append('arrangement_code', params.arrangement_code)
        data.append('region_code', params.region ? params.region.region_code : null)
        axios.post('/update_arrangement', data)
            .then(() => {
                commit('plant_types_loading', false)
                commit('editPlantTypeDialog', false)
                dispatch('getPlantTypes')
            })
            .catch(error => {
                commit('plant_types_loading', false)
                console.log(error)
            })
    },

    deletePlantType({commit, dispatch}, params) {
        commit('plant_types_loading', true)
        axios.get('/delete_arrangement', {params: {id: params.id}})
            .then(() => {
                dispatch('getPlantTypes')
                commit('plant_types_loading', false)
                commit('deletePlantTypeDialog', false)
            })
            .catch(error => {
                commit('plant_types_loading', false)
                console.log(error)
            })
    }
}

const mutations = {
    set_all_plant_types: (state, all_plant_types) => (state.all_plant_types = all_plant_types),
    plant_types_loading: (state, loading) => (state.plant_types_loading = loading),
    deletePlantTypeDialog: (state, dialog) => (state.deletePlantTypeDialog = dialog),
    creatingPlantTypeDialog: (state, dialog) => (state.creatingPlantTypeDialog = dialog),
    editPlantTypeDialog: (state, dialog) => (state.editPlantTypeDialog = dialog),
}

export default {
    state,
    getters,
    actions,
    mutations
}