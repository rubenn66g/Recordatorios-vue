<script setup>
import {supabase} from '../supabase'
import { ref } from 'firebase/database';
var archivo;
var textoRecordatorio= ref("");
var errorEnSubida=false;
function adjuntarArchivo(e) {
    archivo=e.target.files[0];
    console.log("archivo seleccionado "+archivo.name)
}

async function altaRecordatorio() {
  if(archivo){
    const { data, error } = await supabase.storage.from('ArchivosAdjuntos').upload(archivo.name,archivo.value)
    if (error) {
        console.log("se ha producido un error: "+error)
        errorEnSubida=true
    } else {
        console.log("Subido archivo con éxito")
        errorEnSubida=false;
    }
  }
  
  if(!archivo || !errorEnSubida)
  {
    //subir db
    const { data} = await supabase.storage.from('ArchivosAdjuntos').getPublicUrl(archivo.name)
    console.log(data.publicUrl);
  }
}
</script>

<template>
    <form @submit.prevent="altaRecordatorio">
        <label>Texto del recordatorio:</label>
        <input type="file" @change="adjuntarArchivo">
        <button type="submit">Enviar</button>
    </form>
</template>