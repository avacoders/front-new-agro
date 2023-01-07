import Vue from "vue"
import VueRouter from "vue-router"
import routes from "./routes"

Vue.use(VueRouter)

const router = new VueRouter({
    routes, // short for `routes: routes`
    mode: 'history',

    scrollBehavior() {
        return {x: 0, y: 0}
    },
    linkActiveClass: "active", // active class for non-exact links.
    linkExactActiveClass: "active" // active class for *exact* links.
})

export default router