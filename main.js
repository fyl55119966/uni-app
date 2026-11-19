import Vue from 'vue'
import App from './App'
import Cache from './utils/cache'
import configs from './config/app.js'

Vue.prototype.$config = configs
Vue.prototype.$Cache = Cache
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	Cache
})
app.$mount()
