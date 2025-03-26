<script setup lang="ts">

import BottomSheet from '@/components/BottomSheet.vue'
import { ref } from 'vue'

defineProps<{
  buttonText: string;
  sheetTitle: string;
  wrapButton?: boolean;
}>()

const isSheetActive = ref(false)

function toggle() {
  isSheetActive.value = !isSheetActive.value
}

</script>

<template>

  <v-btn :text="buttonText" class="button" :class="{wrapButton}" variant="outlined" @click="toggle" />

  <BottomSheet v-model="isSheetActive" :sheet-title="sheetTitle">
    <slot :toggle="toggle" />
  </BottomSheet>
</template>

<style scoped>
.button {
  border-radius: var(--v-border-button-radius);

}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

.wrapButton {
  height: auto !important;
  max-width: min-content;
}
</style>