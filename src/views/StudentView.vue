<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import TopPanel from '@/components/TopPanel.vue'
import LevelPanel from '@/components/LevelPanel.vue'
import DataTable from '@/components/DataTable.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import {get, del, post} from '@/utils'
import router from '@/router'
import type { StudentResponse, StudentStandardResponse,StudentStandardRequest } from '@/types/types'


const studentInfo = ref<StudentResponse>()
const standardsInfo = ref<StudentStandardResponse[]>([])
const activeLevelNumber = ref(-1)
const changedData = ref<StudentStandardRequest>()

onMounted(async()=>{
    await getStudentById(studentId.value)
    await getNormativesByStudentId(studentId.value)
    setTimeout(() => {
        activeLevelNumber.value = studentInfo?.value?.student_class.number ?? 0
    }, 0);
})

const studentId = computed(() => {
    const urlParts = window.location.pathname.split('/');
    return +urlParts[urlParts.length - 1] 
})

async function getNormativesByStudentId(studentId:number){
    standardsInfo.value = await get(`/api/students/${studentId}/standards/`)
    .then(res => res.json())
    .catch(() => {
        alert('Ошибка доступа к данным')
    })
}

async function getStudentById(studentId : number){
    studentInfo.value = await get(`/api/students/${studentId}`)
    .then(res => res.json())
    .catch(() => {
        alert('Ошибка доступа к данным')
    })
}

const labels = computed(() => {
    let infoLabels = []
    infoLabels.push({
        id: 0,
        label: `Дата рождения: ${studentInfo.value?.birthday ??  ''}`
    })
    infoLabels.push({
        id: 1,
        label: `Класс: ${studentInfo.value?.student_class ? String(studentInfo.value?.student_class.number) + String(studentInfo.value?.student_class.class_name) : ''}`
    })
    infoLabels.push({
        id: 2,
        label: `Пол: ${studentInfo.value?.gender ? studentInfo.value?.gender === 'm' ? 'мальчик' : 'девочка' : ''}`
    })
    return infoLabels
})

const normatives = computed(() =>
    Array.from(standardsInfo.value
    .filter(standard => standard.Level_number === activeLevelNumber.value)
    .map(standard => ({
        student_id: studentId.value,
        id: standard.Standard.Id,
        has_numeric_value: standard.Standard.Has_numeric_value,
        normative: standard.Standard.Name,
        result: +standard.Value.toFixed(2),
        rate: standard.Grade,
        level_number: activeLevelNumber.value
    }))
))

function editStudent(): void {
    router.push({ name: 'update-student', params: { id: studentId.value } })
}
async function deleteStudent() {
    const response = await del('/api/students/' + studentId.value)
    if (!response.ok) {
        alert('Произошла ошибка при удалении, попробуйте снова')
        return
    }
    router.push({name: 'my-classes'})
}
async function postData(){
    const response = await post('/api/students/results/create_or_update/', (changedData.value))
    if(response.ok){
        alert('Данные успешно изменены')
        await getNormativesByStudentId(studentId.value)
    }
    
}
</script>

<template>
    <div>
        <TopPanel class="top-panel">
            <div class="top-panel-title">{{ studentInfo?.full_name ? studentInfo?.full_name : 'студент не найден'}}</div>
        </TopPanel>
        <LevelPanel  
            v-model="activeLevelNumber" 
            :classNumber="studentInfo?.student_class.number ?? 0" 
            class="level-panel"/>
        <div class="main">
            <DataTable 
                v-model="changedData"
                class="table"
                :data="normatives"
                @dataChanged="postData"/>
            <DataTableSideNav
                class="info-panel" 
                :title="'Информация'" 
                :data="labels" 
                :isContentStaticText="true" 
                :pageType="'student'" 
                :hasDeleteMenu="false" 
                @edit="editStudent"
                @delete="deleteStudent"/>
        </div>

    </div>

</template>

<style scoped>

.main{
    display: flex;
    justify-content: space-evenly;
    align-items: start;
    gap: 10px;
    max-width: 1200px;
    margin: 10px auto 0;
}
.table{
    height: calc(100dvh - 230px);
}
.info-panel{
    /*display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgb(var(--v-theme-background));
    border: 1px solid rgb(var(--v-theme-primary));
    border-radius: var(--v-border-radius);
    padding: 0 10px;*/
    height: calc(100dvh - 230px);
}
.info-title{
    text-transform: uppercase;
    font-weight: 700;
    font-size: 20px;
    border-bottom: 1px solid rgb(var(--v-another-surface));
    margin: 5px 18px 15px;
    padding: 0 0 3px;
}
.list{
    background-color: rgb(var(--v-theme-background));
    color: rgb(var(--v-theme-primary)); 
    display: grid;
    gap: 5px;
}
.list-item{
    background-color: rgb(var(--v-theme-surface)) ;
    border-radius: var(--v-border-radius);
    border: 1px solid rgb(var(--v-theme-primary));
}
.buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}
.button {
  border-radius: var(--v-border-radius);
  font-size: 16px;
  flex-grow: 0;
  min-height: 24px;
}
.button:deep(.v-btn__content) {
  white-space: normal !important;
}
.button.v-btn--active {
  background-color: rgb(var(--v-theme-surface));
}
@media (max-width: 1230px) {
    .top-panel-title{
        font-size: 14px;
    }
    .top-panel{
        padding:0;
        margin-bottom: 10px;
    }
    .main{
        flex-direction: column;
        align-items: center;
        padding: 0 10px 10px;
    }
    .info-panel{
        height: 300px;
    }
    .info-title{
        font-size: 14px;
        text-align: center;
    }
    .list-item:deep(.v-list-item){
        width: 100px;
    }
}
</style>