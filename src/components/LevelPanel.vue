<script setup lang="ts">
import { ref } from 'vue'
const activeLevelNumber = ref(1)
const props = defineProps<{
  classNumber: number;
}>()

</script>

<template>
  <div class="container">
    <div class="inner-container">
        <div class="buttons-panel">
            <span class="header">уровни</span>
            <v-btn size="small" class="level-button button" v-for="n in classNumber" :text="n + ' уровень'" :key="n"
                :variant="activeLevelNumber === n ? 'flat' : 'outlined'" color="black"
                @click="activeLevelNumber = n" />
        </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 5px 0;
  height: 60px;
}
.inner-container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 500;
}
.header {
  font-weight: 700;
}
.buttons-panel {
  display: flex;
  gap: 5px;
  align-items: center;
}
.button {
  border-radius: var(--v-border-button-radius);
  text-transform: uppercase;
}
.level-button.v-btn--variant-flat {
  border: 3px solid rgb(var(--v-theme-primary)) !important;
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

</style>