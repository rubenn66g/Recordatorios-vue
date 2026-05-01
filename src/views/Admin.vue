<script setup>
import { ref } from "vue";
import { getFirestore, collection, query, deleteDoc, doc, setDoc, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useCollection } from "vuefire";
import router from '../router/index';

const db = getFirestore();
const auth = getAuth();
const admin = "admin@admin.com";
const edittext = ref("");

onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== admin) {
    router.push("/");
  }
});

const todosRecuerdos = useCollection(query(collection(db, "Recuerdos"), orderBy("prioridad", "asc")));

async function borrarElemento(id) {
  await deleteDoc(doc(db, "Recuerdos", id));
}

async function guardarEditado(elemento) {
  await setDoc(doc(db, "Recuerdos", elemento.id), {
    nombreRec: edittext.value,
    editando: false,
    usuario: elemento.usuario,
    nombreUsuario: elemento.nombreUsuario,
    prioridad: elemento.prioridad,
    tiempo: elemento.tiempo,
    completado: elemento.completado,
    archivoUrl: elemento.archivoUrl || "",
  });
  edittext.value = "";
}

const textosPrioridad = { 1: "Alta", 2: "Media", 3: "Baja" };
</script>

<template>
  <div class="pagina">
    <div class="admin-header">
      <div class="titulo-grupo">
        <span class="badge-admin">Admin</span>
        <h1>Panel de Administración</h1>
      </div>
      <button class="btn-volver" @click="router.push('/Recordatorios')">← Volver</button>
    </div>

    <ul>
      <li v-for="Elemento in todosRecuerdos" :key="Elemento.id" class="item-lista">
        <div class="item-contenido">
          <div class="texto-grupo">
            <span v-if="!Elemento.editando" :class="{ tachado: Elemento.completado }" class="texto-producto">
              {{ Elemento.nombreRec }}
            </span>
            <input v-else v-model="edittext" type="text" class="input-edit"
              @keyup.enter="guardarEditado(Elemento)">
            <span class="usuario-tag">{{ Elemento.nombreUsuario || Elemento.usuario }}</span>
          </div>
          <span class="badge-prioridad" :class="'p' + Elemento.prioridad">
            {{ textosPrioridad[Elemento.prioridad] || '—' }}
          </span>
        </div>
        <div class="acciones">
          <a v-if="Elemento.archivoUrl" :href="`${Elemento.archivoUrl}?download=`" download class="btn-icon descargar">🖇️</a>
          <template v-if="!Elemento.editando">
            <button class="btn-icon editar" @click="Elemento.editando = true; edittext = Elemento.nombreRec">✎</button>
            <button class="btn-icon borrar" @click="borrarElemento(Elemento.id)">✕</button>
          </template>
          <template v-else>
            <button class="btn-ok" @click="guardarEditado(Elemento)">✓</button>
            <button class="btn-cancel" @click="Elemento.editando = false">✕</button>
          </template>
        </div>
      </li>
    </ul>
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

.admin-header {
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

.titulo-grupo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.titulo-grupo h1 {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.badge-admin {
  background: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  border: 1px solid rgba(99, 102, 241, 0.5);
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-volver {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-volver:hover { color: white; border-color: rgba(255, 255, 255, 0.5); }

ul { padding: 0; list-style: none; }

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

.item-lista:hover { border-color: rgba(255, 255, 255, 0.25); background: rgba(255, 255, 255, 0.08); }

.item-contenido { display: flex; align-items: center; gap: 16px; }

.texto-grupo { display: flex; flex-direction: column; gap: 4px; }

.texto-producto { font-size: 1rem; color: #eeeeee; }

.tachado { text-decoration: line-through; color: green; }

.usuario-tag { font-size: 0.72rem; color: rgba(255, 255, 255, 0.35); }

.badge-prioridad { border-radius: 6px; padding: 3px 12px; font-size: 0.78rem; font-weight: 600; }
.badge-prioridad.p1 { background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1px solid #f87171; }
.badge-prioridad.p2 { background: rgba(251, 191, 36, 0.15);  color: #fbbf24; border: 1px solid #fbbf24; }
.badge-prioridad.p3 { background: rgba(74, 222, 128, 0.15);  color: #4ade80; border: 1px solid #4ade80; }

.acciones { display: flex; gap: 8px; }

.btn-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover { border-color: rgba(255, 255, 255, 0.3); color: white; }
.borrar:hover { background: rgba(127, 29, 29, 0.5); color: #fecaca; border-color: #f87171; }

.descargar { text-decoration: none; color: #4ade80; border-color: rgba(74, 222, 128, 0.4); }
.descargar:hover { background: rgba(74, 222, 128, 0.2); border-color: #4ade80; }

.input-edit {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 4px 10px;
  color: white;
  outline: none;
  font-size: 0.95rem;
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
</style>