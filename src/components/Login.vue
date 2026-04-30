<script setup>
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { ref } from "vue";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { GithubAuthProvider } from "firebase/auth";
import { useCollection } from "vuefire";
import router from '../router/index';

const auth = getAuth();
const providerGoogle = new GoogleAuthProvider();
const providerGit = new GithubAuthProvider();

var nombreUsuario = ref("");
var imgUsuario = ref("");
var logueado = ref(false);
var registrar = ref(false);
var correo = ref("");
var contrasena = ref("");
var olvidadoContrasena = ref(false);
var idUsuario;
var recuerdos = ref([]);


function iniciaSesionGoogle() {
  signInWithPopup(auth, providerGoogle)
    .then((result) => {
      const user = result.user;
      logueado.value = true;
      nombreUsuario.value = user.displayName;
      imgUsuario.value = user.photoURL;
      idUsuario = user.uid;
      router.push("/Recordatorios");
    }).catch((error) => {
      console.log(error.message);
    });
}

function iniciaSesionGit() {
  signInWithPopup(auth, providerGit)
    .then((result) => {
      const user = result.user;
      logueado.value = true;
      nombreUsuario.value = user.displayName;
      imgUsuario.value = user.photoURL;
      idUsuario = user.uid;
      router.push("/Recordatorios");
    }).catch((error) => {
      console.log(error.message);
    });
}

function registrarse(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      registrar.value = false;
      router.push("/Recordatorios");
    })
    .catch((error) => {
      alert(error.message);
    });
}

function iniciaSesionEmail(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      router.push("/Recordatorios");
    })
    .catch((error) => {
      alert(error.message);
    });
}

function enviarCorreoContrasena(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Correo enviado");
    })
    .catch((error) => {
      console.log(error.message);
    });
}

</script>

<template>
  <div class="form-card">

    <div v-if="olvidadoContrasena" class="input-grupal-vertical">
      <h1>Recuperar Contraseña</h1>
      <input v-model="correo" type="email" placeholder="Introduce tu Email">
      <button class="btn-principal" @click="enviarCorreoContrasena(correo)">Enviar correo</button>
      <button class="btn-secundario" @click="olvidadoContrasena = false">Volver</button>
    </div>

    <div v-else-if="registrar" class="input-grupal-vertical">
      <h1>Crear Cuenta</h1>
      <input v-model="correo" type="email" placeholder="Introduce tu Email">
      <input v-model="contrasena" type="password" placeholder="Crea una Contraseña">
      <button class="btn-principal" @click="registrarse(correo, contrasena)">Registrarse</button>
      <p>
        ¿Ya tienes cuenta?
        <a href="#" @click="registrar = false">Inicia Sesión</a>
      </p>
    </div>

    <div v-else class="input-grupal-vertical">
      <h1>Iniciar Sesión</h1>
      <input v-model="correo" type="email" placeholder="Email">
      <input v-model="contrasena" type="password" placeholder="Contraseña">
      <button class="btn-principal" @click="iniciaSesionEmail(correo, contrasena)">Entrar</button>
      <button @click="iniciaSesionGoogle">Iniciar sesión con Google</button>
      <button @click="iniciaSesionGit">Iniciar sesión con GitHub</button>
      <div class="enlaces-auxiliares">
        <a href="#" @click="olvidadoContrasena = true">Olvidé mi contraseña</a>
        <br>
        <span>¿No tienes cuenta? </span>
        <a href="#" @click="registrar = true">Regístrate aquí</a>
      </div>
    </div>

  </div>
</template>

<style scoped>
.form-card {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  color: white;
}

.input-grupal-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-grupal-vertical h1 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  text-align: center;
}

.input-grupal-vertical input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.7rem 1rem;
  color: white;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s;
}

.input-grupal-vertical input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.input-grupal-vertical input:focus {
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-principal {
  background: white;
  color: #1a1a2e;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-principal:hover  { opacity: 0.9; }
.btn-principal:active { transform: scale(0.98); }

.btn-secundario {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  padding: 0.7rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secundario:hover { background: rgba(255, 255, 255, 0.08); }

.input-grupal-vertical button:not(.btn-principal):not(.btn-secundario) {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.7rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.input-grupal-vertical button:not(.btn-principal):not(.btn-secundario):hover {
  background: rgba(255, 255, 255, 0.15);
}

.enlaces-auxiliares {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
}

.enlaces-auxiliares a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
}

.enlaces-auxiliares a:hover { text-decoration: underline; }

.input-grupal-vertical p {
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.input-grupal-vertical p a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}
</style>