<script setup>
import { supabase } from '../supabase';

var archivo;
var errorEnSubida = false;

function adjuntarArchivo(e) {
  archivo = e.target.files[0];
  console.log("archivo seleccionado " + archivo.name);
}

async function altaRecordatorio() {
  if (archivo) {
    const { error } = await supabase.storage.from('ArchivosAdjuntos').upload(archivo.name, archivo);
    if (error) {
      console.log("se ha producido un error: " + error);
      errorEnSubida = true;
    } else {
      console.log("Subido archivo con éxito");
      errorEnSubida = false;
    }
  }

  if (!errorEnSubida && archivo) {
    const { data } = await supabase.storage.from('ArchivosAdjuntos').getPublicUrl(archivo.name);
    return data.publicUrl;
  }

  return "";
}

defineExpose({ altaRecordatorio });
</script>

<template>
  <label class="btn-archivo">
    📎
    <input type="file" @change="adjuntarArchivo" style="display:none">
  </label>
</template>

<style scoped>
.btn-archivo {
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 0 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  transition: 0.2s;
}

.btn-archivo:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>