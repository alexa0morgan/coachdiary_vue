<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
</script>

<template>
  <AppBar />

  <v-main>
    <v-img class="main-img" src="/luthfi-alfarizi-8i_KGxVeLtQ-unsplash.jpg" cover>
      <div class="main-img-overlay">
        <h1 class="main-text main-header">Дневник Тренера</h1>
        <p class="main-text describe">Универсальное приложение для тренеров спортивных секций и учителей физической
          культуры</p>
      </div>
    </v-img>

    <h2 id="AboutSite" class="anchor-scroll header">Почему "CoachDiary"?</h2>
    <h2 id="Capabilities" class="anchor-scroll header">Возможности сервиса</h2>
    <h2 id="AboutUs" class="anchor-scroll header">О нас</h2>
    <p style="height: 1080px"></p>
  </v-main>

</template>

<style scoped>
.anchor-scroll {
  scroll-margin-top: 64px;
}

.main-img {
  height: calc(100dvh - 64px);
}

.main-img-overlay {
  backdrop-filter: brightness(110%);
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: "Roboto Condensed", sans-serif;
}

.main-text {
  --border-size: 3px;
  color: white;
  text-shadow: calc(-1 * var(--border-size)) calc(-1 * var(--border-size)) 0 rgb(var(--v-theme-primary)),
  var(--border-size) calc(-1 * var(--border-size)) 0 rgb(var(--v-theme-primary)),
  calc(-1 * var(--border-size)) var(--border-size) 0 rgb(var(--v-theme-primary)),
  var(--border-size) var(--border-size) 0 rgb(var(--v-theme-primary));
  font-weight: bold;
}

.main-header {
  font-size: 70px;
  text-transform: uppercase;
}

.describe {
  --border-size: 2px;
  font-size: 28px;
  width: 700px;
  max-width: 100%;
}

.header{
  padding-top: 40px;
  text-align: center;
  font-size: 35px;
  color: rgb(var(--v-theme-primary));
}
</style>