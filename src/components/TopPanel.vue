<script lang="ts" setup>
defineProps<{
  directionColumn?: boolean;
}>();
</script>

<template>
  <div class="top-panel">
    <div :class="{ directionColumn }" class="inner-container">
      <slot />
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.top-panel {
  display: flex;
  justify-content: stretch;
  align-items: center;
  padding: 5px 8px;
  background-color: rgb(var(--v-theme-primary));
  height: fit-content;
  min-height: 60px;
}

.inner-container {
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  color: rgb(var(--v-theme-secondary));
  font-size: 24px;
  font-weight: bold;
}

.directionColumn {
  flex-direction: column;
}
</style>
