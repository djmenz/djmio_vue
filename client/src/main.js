import 'bootstrap/dist/css/bootstrap.css';
import Vue from 'vue';
import Vuex from 'vuex';
import VueSimpleAlert from 'vue-simple-alert';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import helpers from './mixins/gendata';

Vue.config.productionTip = false;

Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    count: 0,
    converted_data: [],
  },
  mutations: {
    getApiData(state) {
      helpers.methods.getDataM()
        .then((res) => {
          state.converted_data = res;
        });
    },
  },
});

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');

store.commit('getApiData');
Vue.use(VueSimpleAlert);
