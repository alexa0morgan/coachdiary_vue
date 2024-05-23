<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <fieldset class="container">
    <legend>{{ title }}</legend>
    <slot></slot>
  </fieldset>
</template>

<style scoped>
.container {
  border-radius: var(--v-border-radius);
  padding: 5px 10px 7px;
}
legend {
  margin-left: 8px;
  padding: 0 5px;
}
</style>