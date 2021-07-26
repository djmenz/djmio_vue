import 'bootstrap/dist/css/bootstrap.css';
import Vue from 'vue';
import VueSimpleAlert from 'vue-simple-alert';
import myMixin from '@/mixins/gendata';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  mixins: [myMixin],
  render: (h) => h(App),
}).$mount('#app');

Vue.use(VueSimpleAlert);
