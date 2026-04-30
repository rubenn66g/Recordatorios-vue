<script setup>
import { ref } from "vue";
import { getFirestore, collection, query, deleteDoc, doc, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useCollection } from "vuefire";
import router from '../router/index';

const db = getFirestore();
const auth = getAuth();
const admin = "admin@admin.com";

onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== admin) {
    router.push("/");
  }
});

const todosRecuerdos = useCollection(query(collection(db, "Recuerdos"), orderBy("prioridad", "asc")));

async function borrarElemento(id) {
  await deleteDoc(doc(db, "Recuerdos", id));
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
            <span :class="{ tachado: Elemento.completado }" class="texto-producto">
              {{ Elemento.nombreRec }}
            </span>
            <span class="usuario-tag">{{ Elemento.nombreUsuario }}</span>
          </div>
          <span class="badge-prioridad" :class="'p' + Elemento.prioridad">
            {{ textosPrioridad[Elemento.prioridad] || '—' }}
          </span>
        </div>
        <button class="btn-icon borrar" @click="borrarElemento(Elemento.id)">✕</button>
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

.btn-volver:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
}

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
  align-items: center;
  gap: 16px;
}

.texto-grupo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.texto-producto {
  font-size: 1rem;
  color: #eeeeee;
}

.tachado {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.3);
}

.usuario-tag {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.35);
}

.badge-prioridad {
  border-radius: 6px;
  padding: 3px 12px;
  font-size: 0.78rem;
  font-weight: 600;
}

.badge-prioridad.p1 { background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1px solid #f87171; }
.badge-prioridad.p2 { background: rgba(251, 191, 36, 0.15);  color: #fbbf24; border: 1px solid #fbbf24; }
.badge-prioridad.p3 { background: rgba(74, 222, 128, 0.15);  color: #4ade80; border: 1px solid #4ade80; }

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
  border-color: #f87171;
  background: rgba(127, 29, 29, 0.4);
  color: #fecaca;
}
</style>