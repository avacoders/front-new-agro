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
    {
        path: '/agronom-cards',
        name: 'agronom.index',
        component: () => import('@/pages/agronom/AgronomIndex'),
    },
    {
        path: '/fields',
        name: 'fields.index',
        component: () => import('@/pages/fields/FieldIndex'),
    },
    ...regions,
    ...districts,
    ...mfies,
    ...arrangements,
    ...plant_types

]

export default routes