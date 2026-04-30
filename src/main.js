
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueFire } from 'vuefire'
import { initializeApp } from "firebase/app";
import supabaseStorage from './components/supabaseStorage.vue';

const firebaseConfig = {
  apiKey: "AIzaSyBPWo4n4ThK7B79jJl31hqxDutP1KY3MMQ",
  authDomain: "recordatorios-6aecf.firebaseapp.com",
  projectId: "recordatorios-6aecf",
  storageBucket: "recordatorios-6aecf.firebasestorage.app",
  messagingSenderId: "321882551952",
  appId: "1:321882551952:web:10c47d5c6890053c804a15"
};

const firebaseApp = initializeApp(firebaseConfig);

const app = createApp(App)

app.use(router)

app.use(VueFire,{
    firebaseApp,
    modules:[],
});

app.mount('#app')

