<script setup lang="ts">


import { computed, onMounted, ref } from 'vue'
import type { ClassRequest, StudentResponse } from '@/types/types'
import { useRoute, useRouter } from 'vue-router'
import { get, getErrorMessage } from '@/utils'
import { toast } from 'vue-sonner'

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
    let response
    if (classNumber == 12) {
      response = await get(`/api/students/`)
    } else {
      response = await get(`/api/students/`, {
        'student_class': fullClassName.value
      })
    }
    if (response.ok) {
      const currentStudents = await response.json() as StudentResponse[]
      emit('studentsData', currentStudents, classNumber, letter)
    } else {
      toast.error(getErrorMessage((await response.json()).details))
    }
  } catch {
    toast.error('Произошла ошибка во время получения данных, попробуйте еще раз')
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
    <v-divider v-if="!directionColumn" class="divider" vertical color="rgb(var(--v-theme-secondary))" thickness="3"
               opacity="0.5" />
    <v-divider v-else class="divider" color="rgb(var(--v-theme-secondary))" thickness="3" opacity="0.5" />
    <v-btn
      :variant="activeLevelNumber === 12 ? 'flat' : 'outlined'"
      class="level-button top-button"
      color="rgb(var(--v-theme-secondary))"
      @click="getStudentsData(12, '', true) ">
      все
    </v-btn>
  </div>
</template>

<style scoped>
.buttons-panel {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.directionColumn {
  flex-direction: column;
  height: 100%;
}

.top-button {
  border-radius: var(--v-border-button-radius);
}

.level-button.v-btn--variant-flat {
  border: 1px solid rgb(var(--v-theme-secondary)) !important;
}

.divider {
  margin: 0 10px;
}

@media (max-height: 700px) {
  .buttons-panel {
    gap: 5px;
  }

  .divider {
    margin: 10px 5px;
  }
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