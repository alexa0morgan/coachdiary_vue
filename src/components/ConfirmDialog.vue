<script setup lang="ts">
import { confirmDialogs } from '@/utils'
import { computed } from 'vue'

const lastDialog = computed(() => confirmDialogs.value.at(-1))

</script>

<template>
  <v-dialog :model-value="!!lastDialog" max-width="340" persistent>
    <v-card
      :title="lastDialog?.title"
      :text="lastDialog?.text"
    >
      <template #actions>
        <v-spacer />

        <v-btn color="success" @click="lastDialog?.cancelAction">
          {{ lastDialog?.cancelText }}
        </v-btn>

        <v-btn color="error" @click="lastDialog?.confirmAction">
          {{ lastDialog?.confirmText }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>