import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
//WaveUI
import WaveUI from 'wave-ui';
import 'wave-ui/dist/wave-ui.css';

const app = createApp(App);
/*WaveUI */
app.use(WaveUI, { theme: 'auto' });
app.use(router).mount('#app');
