<script lang="ts" setup>

</script>

<template>
  <div class="top-panel">
    <div class="inner-container">
      <slot />
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.top-panel {
  padding: 5px 8px;
  height: 60px;
  background-color: rgb(var(--v-theme-primary));
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
}

@media (max-width: 800px) {
  .top-panel {
    height: fit-content;
    min-height: 60px;
  }
}

</style>