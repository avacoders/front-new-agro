// import axios from 'axios'

const state = {
    fields: [],
    field: {},
    fields_loading: false,
    editing_field: {},
    deleting_field: {},
    creating_field_dialog: false
}

const getters = {
    fields: state => state.fields,
    field: state => state.field,
    fields_loading: state => state.fields_loading,
    editing_field: state => state.editing_field,
    deleting_field: state => state.deleting_field,
    creating_field_dialog: state => state.creating_field_dialog,
}

const actions = {

}

const mutations = {
    fields: (state, fields) => (state.fields = fields),
    field: (state, field) => (state.field = field),
    fields_loading: (state, fields_loading) => (state.fields_loading = fields_loading),
    editing_field: (state, editing_field) => (state.editing_field = editing_field),
    deleting_field: (state, deleting_field) => (state.deleting_field = deleting_field),
    creating_field_dialog: (state, creating_field_dialog) => (state.creating_field_dialog = creating_field_dialog),
}

export default {
    state,
    getters,
    actions,
    mutations
}