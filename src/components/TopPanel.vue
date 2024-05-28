<script setup lang="ts">

</script>

<template>
  <div class="container">
    <div class="inner-container">
      <slot />
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 5px 0;
  height: 60px;
  background-color: rgb(var(--v-theme-primary));
  @media (max-width: 760px) {
    height: 70px;
    margin: 0;
  }
}

.inner-container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  color: rgb(var(--v-theme-secondary));
  font-size: 24px;
  text-transform: uppercase;
  font-weight: bold;

  @media (max-width: 1230px) {
    padding: 8px;
  }
}

</style>