import { createRouter, createWebHistory } from "vue-router";
import RobotList from "./components/RobotList.vue";
import RobotForm from "./components/RobotForm.vue";
import TorneoList from "./components/TorneoList.vue";
import TorneoForm from "./components/TorneoForm.vue";
import SimulacionTorneo from './components/SimulacionTorneo.vue'  // Asegúrate de crear este componente


const routes = [
    { path: "/", redirect: "/robots" },
    { path: "/robots", name: "RobotList", component: RobotList },
    { path: "/robots/new", name: "NewRobot", component: RobotForm },
    { path: "/robots/edit/:id", name: "EditRobot", component: RobotForm, props: true },
    { path: "/torneos", name: "TorneoList", component: TorneoList },
    { path: "/torneos/new", name: "NewTorneo", component: TorneoForm },
    { path: "/torneos/edit/:id", name: "EditTorneo", component: TorneoForm, props: true },
    {
        path: "/simulacion/:participantes",
        name: "SimulacionTorneo",
        component: SimulacionTorneo,
        props: true
    },
];


const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
