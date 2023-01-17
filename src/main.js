import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router";
import store from "./store";

Vue.config.productionTip = false
import axios from 'axios'

window.axios = axios
window.axios.defaults.baseURL = "http://192.168.44.16:5001"
window.axios.defaults.headers.post['mimeType'] = 'multipart/form-data';
window.axios.defaults.headers.post['processData'] = false;
window.axios.defaults.headers.post['contentType'] = false;

import 'leaflet/dist/leaflet.css';

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App),
    provide: {
        metaInfo: {
            titleTemplate: "123"
        }
    }
}).$mount('#app')
