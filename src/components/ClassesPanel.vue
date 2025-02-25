<script setup lang="ts">


import { computed, onMounted, ref } from 'vue'
import type { ClassRequest, StudentResponse } from '@/types/types'
import { useRoute, useRouter } from 'vue-router'
import { get } from '@/utils'

defineProps<{
  directionColumn?: boolean;
  menu?: boolean;
}>()

const emit = defineEmits<{
    studentsData: [students: StudentResponse[], classNumber: number, letter: string];
    classesData: [classes: ClassRequest[]];
    buttonClick: [];
}>()


const route = useRoute()
const router = useRouter()
const classesData = ref<ClassRequest[]>([])

const activeLevelNumber = ref(+route.query.classNumber! || -1)
const className = ref(route.query.letter as string || '')
const fullClassName = computed(() =>
  className.value ? activeLevelNumber.value + className.value : activeLevelNumber.value
)

const classes = computed(() =>
  classesData.value
    .reduce((acc, v) => {
      if (!(v.number in acc)) {
        acc[v.number] = [] as string[]
      }
      acc[v.number].push(v.class_name)
      return acc
    }, {} as Record<number, string[]>)
)

async function getStudentsData(classNumber: number, letter: string, emitButtonClick = false) {
  activeLevelNumber.value = classNumber
  className.value = letter
  await router.replace({
    query: {
      ...route.query,
      classNumber: classNumber,
      letter: letter
    }
  })

  if (emitButtonClick) {
    emit('buttonClick')
  }

  try {
    const currentStudents = await get('/api/students/', {
      'student_class': fullClassName.value
    })
      .then(res => res.json() as Promise<StudentResponse[]>)
    emit('studentsData', currentStudents, classNumber, letter);
  } catch {
    alert('Ошибка при получении данных, попробуйте позже')
  }
}

onMounted(async () => {
  classesData.value = await get('/api/classes/').then(res => res.json())
  emit('classesData', classesData.value)
  if (activeLevelNumber.value !== -1) {
    await getStudentsData(activeLevelNumber.value, className.value)
  }
})


</script>

<template>
  <div :class="{directionColumn}" class="buttons-panel">
    <v-btn
      v-for="n in 11"
      :key="n"
      :disabled="!(n in classes)"
      :variant="activeLevelNumber === n ? 'flat' : 'outlined'"
      class="level-button top-button"
      color="rgb(var(--v-theme-secondary))"
      @click="!menu ? getStudentsData(n, '', true) : ''">

      {{ n }}{{ activeLevelNumber === n ? className : '' }}
      <v-menu v-if="menu" activator="parent" location="bottom center" offset="5"
              transition="slide-y-transition">
        <v-list base-color="rgb(var(--v-theme-secondary))" bg-color="rgb(var(--v-theme-primary))"
                density="compact" elevation="0">
          <v-list-item v-for="letter in classes[n]" :key='n + letter' class="text-center"
                       @click="getStudentsData(n, letter, true)">
            <v-list-item-title>{{ letter.toUpperCase() }}</v-list-item-title>
          </v-list-item>
          <v-list-item class="text-center" @click="getStudentsData(n, '', true)">
            <v-list-item-title>Параллель</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </div>
</template>

<style scoped>
.buttons-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.directionColumn {
  flex-direction: column;
}

.top-button {
  border-radius: var(--v-border-button-radius);
}

.level-button.v-btn--variant-flat {
  border: 1px solid rgb(var(--v-theme-secondary)) !important;
}

@media (max-width: 960px) {
  a.v-btn {
    display: none;
  }

  button.v-btn {
    height: 1.5em;
  }

  .buttons-panel {
    gap: 5px;
  }
}

@media (max-width: 430px) {
  button.v-btn {
    height: 1.3em;
  }
}
</style>