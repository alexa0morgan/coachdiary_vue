<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  classNumber: number;
}>()
const activeLevel = defineModel<number>({default: -1, required: false})
const emit = defineEmits<{
  levelChanged: []
}>()
</script>

<template>
  <div class="container">
    <div class="inner-container">
        <div class="buttons-panel">
            <span class="header">уровни</span>
            <v-btn size="small" class="level-button button" v-for="n in classNumber" :text="n + ' уровень'" :key="n"
                :variant="activeLevel === n ? 'flat' : 'outlined'" color="black"
                @click="activeLevel = n, emit('levelChanged')" />
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
  @media (max-width: 1230px) {
    padding-inline: 10px;
  }
}
.header {
  font-weight: 700;
  @media (max-width: 1230px) {
    font-size: 15px;
  }
}
.buttons-panel {
  display: flex;
  gap: 5px;
  align-items: center;
  @media (max-width: 1230px) {
    flex-wrap: wrap;
    padding: 10px
  }
}
.button {
  border-radius: var(--v-border-button-radius);
  text-transform: uppercase;
  @media (max-width: 1230px) {
    font-size: 10px;
    padding: 0 5px;
    height: 20px !important;
  }
}
.level-button.v-btn--variant-flat {
  border: 3px solid rgb(var(--v-theme-primary)) !important;
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}


</style>