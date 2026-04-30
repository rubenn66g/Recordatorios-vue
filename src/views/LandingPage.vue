<script setup>
import Login from '@/components/Login.vue';
</script>

<template>
  <div class="landing">
    <div class="fondo-animado">
      <span v-for="n in 20" :key="n" class="particula"></span>
    </div>
    <div class="contenido">
      <div class="hero">
        <img src="../assets/logo-recordatorios.png" class="hero-img" alt="logo">
        <h1>Recordatorios</h1>
        <p>Organiza todas tus tareas en un solo lugar</p>
      </div>
      <Login />
    </div>
  </div>
</template>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

.fondo-animado {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particula {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: flotar var(--dur) linear infinite;
}

.particula:nth-child(1)  { left: 5%;  --dur: 8s;  animation-delay: 0s;   width: 3px; height: 3px; }
.particula:nth-child(2)  { left: 10%; --dur: 12s; animation-delay: 1s;   width: 5px; height: 5px; }
.particula:nth-child(3)  { left: 18%; --dur: 9s;  animation-delay: 2s; }
.particula:nth-child(4)  { left: 25%; --dur: 14s; animation-delay: 0.5s; width: 6px; height: 6px; }
.particula:nth-child(5)  { left: 33%; --dur: 10s; animation-delay: 3s; }
.particula:nth-child(6)  { left: 42%; --dur: 7s;  animation-delay: 1.5s; width: 2px; height: 2px; }
.particula:nth-child(7)  { left: 50%; --dur: 11s; animation-delay: 4s; }
.particula:nth-child(8)  { left: 58%; --dur: 13s; animation-delay: 0s;   width: 5px; height: 5px; }
.particula:nth-child(9)  { left: 65%; --dur: 8s;  animation-delay: 2.5s; }
.particula:nth-child(10) { left: 72%; --dur: 10s; animation-delay: 1s; }
.particula:nth-child(11) { left: 80%; --dur: 15s; animation-delay: 3.5s; width: 6px; height: 6px; }
.particula:nth-child(12) { left: 88%; --dur: 9s;  animation-delay: 0.5s; }
.particula:nth-child(13) { left: 93%; --dur: 12s; animation-delay: 2s; }
.particula:nth-child(14) { left: 15%; --dur: 6s;  animation-delay: 5s;   width: 2px; height: 2px; }
.particula:nth-child(15) { left: 37%; --dur: 11s; animation-delay: 1.5s; }
.particula:nth-child(16) { left: 55%; --dur: 8s;  animation-delay: 4.5s; width: 3px; height: 3px; }
.particula:nth-child(17) { left: 70%; --dur: 13s; animation-delay: 0.5s; }
.particula:nth-child(18) { left: 82%; --dur: 7s;  animation-delay: 3s;   width: 5px; height: 5px; }
.particula:nth-child(19) { left: 45%; --dur: 10s; animation-delay: 2s; }
.particula:nth-child(20) { left: 96%; --dur: 9s;  animation-delay: 1s; }

@keyframes flotar {
  0%   { transform: translateY(110vh) scale(0); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

.contenido {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.hero {
  text-align: center;
  color: white;
}

.icono {
  font-size: 56px;
  margin-bottom: 0.5rem;
  animation: pulsar 2s ease-in-out infinite;
}

@keyframes pulsar {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.08); }
}

.hero h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
  letter-spacing: -0.5px;
}

.hero p {
  font-size: 1rem;
  opacity: 0.7;
  margin: 0;
}
.hero-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 0.5rem;
  animation: pulsar 2s ease-in-out infinite;
}
</style>