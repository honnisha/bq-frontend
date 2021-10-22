import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import Main from './Main.vue'
import i18n from "./i18n";

const app = createApp(Main)
app.use(ElementPlus)
app.use(i18n)
app.mount('#app')
