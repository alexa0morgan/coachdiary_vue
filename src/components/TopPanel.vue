<!--suppress CssUnresolvedCustomProperty -->
<script setup lang="ts">

</script>

<template>
  <div class="container">
    <div class="inner-container">
      <slot/>
      <slot name="right"/>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 5px 0;
  min-height: 60px;
  background-color: rgb(var(--v-theme-primary));
}

.inner-container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  height: 100%;
  justify-content: space-between;
  align-items: center;
}
</style>