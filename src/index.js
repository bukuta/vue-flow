import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './app.vue';
import fa from './font-awesome-unicode-map';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI, { size: 'mini' });

new Vue({
  el: '#app',
  ...App,
});
