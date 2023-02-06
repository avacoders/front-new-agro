import regions from "./regions";
import districts from "./districts";
import mfies from "@/router/mfies";
import arrangements from "@/router/arrangements";
import plant_types from "@/router/plant_types";

const routes = [
    {
        path: '/',
        redirect: '/tech-cards',
    },
    {
        path: '/tech-cards',
        name: 'tech_cards.index',
        component: () => import('@/pages/tech_cards/TechCardIndex'),
    },

    ...regions,
    ...districts,
    ...mfies,
    ...arrangements,
    ...plant_types

]

export default routes