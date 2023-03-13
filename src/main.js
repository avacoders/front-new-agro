import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from "./router";
import store from "./store";
import axios from 'axios'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false
window.axios = axios
 window.axios.defaults.baseURL = "http://92.63.206.12:5200"
// window.axios.defaults.baseURL = "http://192.168.44.16:5001"
window.axios.defaults.headers.post['mimeType'] = 'multipart/form-data';
window.axios.defaults.headers.post['processData'] = false;
window.axios.defaults.headers.post['contentType'] = false;

import 'leaflet/dist/leaflet.css';
Vue.use(VueSweetalert2);
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
