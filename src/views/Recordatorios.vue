<script setup>
import { ref,computed} from "vue";
import { addDoc, collection, getFirestore, doc, deleteDoc, setDoc, query, where, serverTimestamp, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { useCollection } from "vuefire";
import router from '../router/index';

const db = getFirestore();
const auth = getAuth();

const logueado = ref(false);
const nombreUsuario = ref("");
const imgUsuario = ref("");
let idUsuario = "";
let recuerdos = ref([]);
let admin = "admin@admin.com";
const text = ref("");
const edittext = ref("");
const prioridad = { 1: "Alta", 2: "Medio", 3: "Bajo" };
const prioridadNueva = ref(3);
let esAdmin = ref(false);

onAuthStateChanged(auth, (user) => {
  if (user) {
    logueado.value = true;
    nombreUsuario.value = user.displayName || user.email || "Usuario";
    imgUsuario.value = user.photoURL || "";
    idUsuario = user.uid;
    if (admin == user.email) {
      esAdmin.value = true;
    }
    const q = query(collection(db, "Recuerdos"), where("usuario", "==", idUsuario), orderBy("prioridad", "asc"));
    recuerdos = useCollection(q);
  } else {
    logueado.value = false;
    recuerdos.value = [];
    router.push("/");
  }
});

setPersistence(auth, browserSessionPersistence)
  .catch((error) => console.error(error.message));

function cerrarSesion() {
  signOut(auth).then(() => {
    logueado.value = false;
    router.push("/");
  }).catch((error) => console.log(error));
}

async function agregarElemento() {
  await addDoc(collection(db, "Recuerdos"), {
    nombreRec: text.value,
    editando: false,
    usuario: idUsuario,
    nombreUsuario: nombreUsuario.value,
    prioridad: prioridadNueva.value,
    tiempo: serverTimestamp(),
    completado: false,
  });
  text.value = "";
  prioridadNueva.value = 3;
}

async function cambiarPrioridad(elemento, valor) {
  await setDoc(doc(db, "Recuerdos", elemento.id), {
    nombreRec: elemento.nombreRec,
    editando: elemento.editando,
    usuario: elemento.usuario,
    nombreUsuario: elemento.nombreUsuario,
    prioridad: valor,
    tiempo: elemento.tiempo,
    completado: elemento.completado,
  });
}

async function borrarElemento(id) {
  await deleteDoc(doc(db, "Recuerdos", id));
}

async function guardarEditado(id,completado) {
  await setDoc(doc(db, "Recuerdos", id), {
    nombreRec: edittext.value,
    editando: false,
    usuario: idUsuario,
    nombreUsuario:nombreUsuario.value,
    prioridad: "",
    tiempo: serverTimestamp(),
    completado: completado,
  });
  edittext.value = "";
}

function tiempoRelativo(timestamp) {
  if (!timestamp) return "";
  const ahora = Date.now();
  const fecha = timestamp.toDate().getTime();
  const diff = Math.floor((ahora - fecha) / 1000);
  let texto = "";

  if (diff < 60)
    texto = "hace unos segundos";
  else if (diff < 3600)
    texto = `hace ${Math.floor(diff / 60)} min`;
  else if (diff < 86400)
    texto = `hace ${Math.floor(diff / 3600)} h`;
  else
    texto = `hace ${Math.floor(diff / 86400)} días`;

  return texto;
}
 function borrarTodo() {
  for (const elemento of recuerdos.value) {
       deleteDoc(doc(db, "Recuerdos", elemento.id));
    }
  }

function borrarCompletados() {
  for (const elemento of recuerdos.value) {
    if (elemento.completado) {
      deleteDoc(doc(db, "Recuerdos", elemento.id));
    }
  }
}

</script>

<template>
  <div class="pagina">
  <div class="user-header" v-if="logueado">
    <button v-if="esAdmin" @click="router.push('/Admin')" class="panelAdmin">panel administrador</button>
    <div class="user-info">
      <span class="user-name">{{ nombreUsuario }}</span>
      <img v-if="imgUsuario" :src="imgUsuario" class="user-avatar" alt="Perfil">
    </div>
    <button class="btn-session logout" @click="cerrarSesion">Cerrar Sesión</button>
  </div>
  <p class="contador">{{ recuerdos.filter(r => !r.completado).length }} / {{ recuerdos.length }} pendientes</p>
  <div class="input-grupal">
    <input v-model="text" type="text" @keyup.enter="agregarElemento" placeholder="Añadir recordatorio...">
    <button class="btn-principal" @click="agregarElemento">Añadir</button>
  </div>
  
  <ul>
    <li v-for="Elemento in recuerdos" :key="Elemento.id" class="item-lista">
      <div class="item-contenido">
        <input type="checkbox" :checked="Elemento.completado" @change="setDoc(doc(db, 'Recuerdos', Elemento.id), {...Elemento, completado: !Elemento.completado})">
        <div class="texto-grupo">
          <span v-if="!Elemento.editando" :class="{ tachado: Elemento.completado }" class="texto-producto">
            {{ Elemento.nombreRec }}
          </span>
          <input v-else v-model="edittext" type="text" class="input-edit"
            @keyup.enter="guardarEditado(Elemento.id, Elemento.completado)">
          <span class="tiempo-relativo">{{ tiempoRelativo(Elemento.tiempo) }}</span>
          <div class="prioridad-fila">
            <span class="prioridad-label">Prioridad:</span>
            <button class="btn-prioridad alta" :class="{ activo: Elemento.prioridad === 1 }"
              @click="cambiarPrioridad(Elemento, 1)">Alta</button>
            <button class="btn-prioridad media" :class="{ activo: Elemento.prioridad === 2 }"
              @click="cambiarPrioridad(Elemento, 2)">Medio</button>
            <button class="btn-prioridad baja" :class="{ activo: Elemento.prioridad === 3 }"
              @click="cambiarPrioridad(Elemento, 3)">Bajo</button>
          </div>
        </div>
      </div>
      <div class="acciones">
        <template v-if="!Elemento.editando">
          <button class="btn-icon editar" @click="Elemento.editando = true; edittext = Elemento.nombreRec">✎</button>
          <button class="btn-icon borrar" @click="borrarElemento(Elemento.id)">✕</button>
        </template>
        <template v-else>
          <button class="btn-ok" @click="guardarEditado(Elemento.id, Elemento.completado)">✓</button>
          <button class="btn-cancel" @click="Elemento.editando = false">✕</button>
        </template>
      </div>
    </li>
  </ul>
  <button class="btn-borrar-completados" @click="borrarCompletados">Borrar Realizados</button>
  <button class="btn-borrar-todo" @click="borrarTodo">Borrar todo</button>
</div>
</template>

<style scoped>
.pagina {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #e0e0e0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  padding: 20px;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  margin-bottom: 30px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 600;
  color: #ffffff;
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.input-grupal {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.input-grupal input {
  flex: 1;
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 12px 16px;
  border-radius: 10px;
  outline: none;
  font-size: 0.95rem;
  transition: border 0.2s;
}

.input-grupal input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.input-grupal input:focus {
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-principal {
  background: white;
  color: #1a1a2e;
  border: none;
  padding: 0 25px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-principal:hover  { opacity: 0.9; }
.btn-principal:active { transform: scale(0.98); }

ul {
  padding: 0;
  list-style: none;
}

.item-lista {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 18px;
  border-radius: 14px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
}

.item-lista:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
}

.item-contenido {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

input[type="checkbox"] {
  margin-top: 5px;
  width: 18px;
  height: 18px;
  accent-color: #ffffff;
  cursor: pointer;
}

.texto-grupo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.texto-producto {
  font-size: 1.1rem;
  color: #eeeeee;
  font-weight: 400;
}

.tachado {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.3);
}

.tiempo-relativo {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.prioridad-fila {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.prioridad-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.btn-prioridad {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.4);
  padding: 2px 10px;
  font-size: 0.7rem;
  border-radius: 5px;
  cursor: pointer;
  opacity: 0.4;
  transition: 0.2s;
}

.btn-prioridad.activo { opacity: 1; }

.btn-prioridad.baja.activo  { color: #4ade80; border-color: #4ade80; background: rgba(74, 222, 128, 0.1); }
.btn-prioridad.media.activo { color: #fbbf24; border-color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
.btn-prioridad.alta.activo  { color: #f87171; border-color: #f87171; background: rgba(248, 113, 113, 0.1); }

.acciones {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-icon:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.borrar:hover {
  background: rgba(127, 29, 29, 0.5);
  color: #fecaca;
  border-color: #f87171;
}

.logout {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.logout:hover {
  color: #f87171;
  border-color: #f87171;
}

.btn-ok {
  background: white;
  color: #1a1a2e;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
}

button[onClick*="Admin"] {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.4);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: 0.2s;
}

button[onClick*="Admin"]:hover {
  background: rgba(99, 102, 241, 0.35);
  border-color: #6366f1;
}

.input-edit {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 4px 10px;
  color: white;
  outline: none;
  font-size: 0.95rem;
}
.panelAdmin {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.4);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: 0.2s;
}

.panelAdmin {
  background: rgba(99, 102, 241, 0.35);
  border-color: #6366f1;
  color: white;
}

.btn-borrar-completados {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  border: 1px solid #fbbf24;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 16px;
  margin-right: 10px;
}

.btn-borrar-completados:hover {
  background: rgba(251, 191, 36, 0.2);
}

.btn-borrar-todo {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid #f87171;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 16px;
}

.btn-borrar-todo:hover {
  background: rgba(248, 113, 113, 0.2);
}

.contador {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}
</style>