import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import store from './store'; 

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App);

app.use(VueSweetalert2);
app.use(store); 
app.mount('#app');
