import regions from "./regions";
import districts from "./districts";

const routes = [
    {
        path: '/',
        redirect: '/regions',
    },

    ...regions,
    ...districts,

]

export default routes