<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer>
    <div class="footer">

      <div class="footer-column">
        <div class="header">О компании</div>
        <RouterLink :to="{name: 'about-site'}">О сайте</RouterLink>
        <RouterLink :to="{name: 'about-us'}" variant="text">О нас</RouterLink>
      </div>

      <div class="footer-column">
        <div class="header">Возможности</div>
        <RouterLink to="/#Capabilities">Преподавателям</RouterLink>
      </div>

      <div class="footer-column">
        <div class="header">Контакты</div>
        <div> 2024 — <strong>CoachDiary</strong></div>
      </div>
    </div>

  </footer>
</template>

<style scoped>
footer {
  padding: 20px 30px;
  background-color: rgb(var(--v-theme-surface-variant));
  color: rgb(var(--v-theme-on-surface-variant));
}

.footer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.header {
  font-weight: bold;
  margin-bottom: 5px;
}

footer :deep(a) {
  color: #bebebe;
  text-decoration: none;
  font-size: 14px;
}
</style>