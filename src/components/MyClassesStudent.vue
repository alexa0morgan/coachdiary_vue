<script setup lang="ts">
import type { StudentResponse } from '@/types/types'
import { computed, ref } from 'vue'

const { student } = defineProps<{
  i: number,
  student: StudentResponse,
}>()

const showCode = ref(false)

const invitationCode = computed(() => {
  if (!showCode.value) return "Показать"
  return student.invitation_link.split('/').pop()
})

</script>

<template>
  <div>{{ i }}</div>
  <v-btn
    :to="{name: 'student', params: { id: student.id } }"
    class="button"
    variant="text">
    {{ student.full_name }}
  </v-btn>
  <v-btn
    variant="tonal"
    :text="invitationCode"
    @click="showCode=!showCode" />
</template>

<style scoped>

.button {
  justify-content: start;
}

.button:deep(.v-btn__content) {
  white-space: normal !important;
}

</style>