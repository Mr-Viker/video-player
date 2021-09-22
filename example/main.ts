import Vue from 'vue'
import App from './App.vue'
import VideoPlayer from '../src';
// import VideoPlayer from '../dist';
// import '../dist/index.css';

Vue.config.productionTip = false

Vue.use(VideoPlayer);

new Vue({
  render: h => h(App),
}).$mount('#app')
