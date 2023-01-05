import Vue from "vue";
import { ToastPlugin, ModalPlugin } from "bootstrap-vue";
import VueCompositionAPI from "@vue/composition-api";
import axios from "../src/libs/axios";
import VueMoment from "vue-moment";
import moment from "moment-timezone";

import router from "./router";
import store from "./store";
import App from "./App.vue";

// Global Components
import "./global-components";

// 3rd party plugins
import "@/libs/portal-vue";
import "@/libs/toastification";

// BSV Plugin Registration
Vue.use(ToastPlugin);

//vue-moment
Vue.use(require("vue-moment"));
Vue.use(moment);

Vue.use(ModalPlugin);

// Composition API
Vue.use(VueCompositionAPI);

// import core styles
require("@core/scss/core.scss");

// import assets styles
require("@/assets/scss/style.scss");

//mixin
import './mixin'

// axios
// Vue.use(axios);

// axios
Vue.prototype.$http = axios;
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
