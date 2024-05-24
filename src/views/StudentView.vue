<script setup lang="ts">
import {ref} from 'vue'
import TopPanel from '@/components/TopPanel.vue'
import LevelPanel from '@/components/LevelPanel.vue'
import DataTable from '@/components/DataTable.vue'
import DataTableSideNav from '@/components/DataTableSideNav.vue'
import {get} from '@/utils'

const studentId = () => {
    const urlParts = window.location.pathname.split('/');
    return +urlParts[urlParts.length - 1] 
}

async function getNormativesById(normativeId:number){
    const response = await get(`/api/students/${normativeId}/standards/`)
    if(response.ok){
        response.json()
        .then(data => {
            /*if (typeof data === 'object' && data !== null ) {
                
            }*/
        })
    }
}
interface Student {
  id: number;
  fullName: string;
  class: Record<string, string | number>;
  birthday: string;
  gender: string
}
interface Standard {
  id: number;
  standard: Record<string, string | boolean>;
  grade: number;
  gender: number;
}
const studentInfo = ref<Student>()

async function getStudentById(studentId : number){
    const response = await get(`/api/students/${studentId}`)
    if(response.ok){
        response.json()
        .then(data => {
            if (typeof data === 'object' && data !== null) {
                studentInfo.value = {
                    id: data.id,
                    fullName : data.full_name,
                    class : data.student_class,
                    birthday : data.birthday, 
                    gender : data.gender
                }
            }
        })
        .catch(() => {
            alert('Ошибка доступа к данным')
        })
    }
}
const labels = (info : Student | undefined) => {
    let infoLabels = []
    infoLabels.push({
        id: 0,
        label: `Дата рождения: ${info?.birthday ? info?.birthday : ''}`
    })
    infoLabels.push({
        id: 1,
        label: `Класс: ${info?.class ? String(info?.class.number)+String(info?.class.class_name) : ''}`
    })
    infoLabels.push({
        id: 2,
        label: `Пол: ${info?.gender ? info?.gender === 'm' ? 'мальчик' : 'девочка' : ''}`
    })
    return infoLabels
}
const normatives = [
    { id: 0, number:1, normative: 'бег 100м', result: 15, rate: 5 },
    { id: 1, number:2, normative: 'метание мяча', result: 60, rate: 5},
    { id: 2, number:3, normative: 'прыжок в длину', result: 1.20, rate: 4 },
    { id: 3, number:4, normative: 'бег 100м', result: 15, rate: 5 },
    { id: 4, number:5, normative: 'метание мяча', result: 60, rate: 5},
    { id: 5, number:6, normative: 'прыжок в длину', result: 1.20, rate: 4 },
    { id: 6, number:7, normative: 'бег 100м', result: 15, rate: 5 },
    { id: 7, number:8, normative: 'метание мяча', result: 60, rate: 5},
    { id: 8, number:9, normative: 'прыжок в длину', result: 1.20, rate: 4 },
    { id: 9, number:10, normative: 'бег 100м', result: 15, rate: 5 },
    { id: 10, number:11, normative: 'метание мяча', result: 60, rate: 5},
    { id: 11, number:12, normative: 'прыжок в длину', result: 1.20, rate: 4 },
]



function getClassNumber(cl:string){
    if(cl.length >2){
        return +cl.slice(0,2)
    }
    return +cl.slice(0,1)
}
function dateBirth(date:Date){
    let day = String(date.getDate())
    let month = String(date.getMonth())
    if(day.length==1){
        day = 0+day 
    }
    if(month.length==1){
        month = 0+month
    }
    return day + '.' + month + '.' + String(date.getFullYear())
}

getStudentById(studentId())

</script>

<template>
    <div>
        <TopPanel class="top-panel">
            <div class="top-panel-title">{{ studentInfo?.fullName ? studentInfo?.fullName : 'студент не найден'}}</div>
        </TopPanel>
        <LevelPanel :classNumber="studentInfo?.class.number ? +studentInfo?.class.number : 0" class="level-panel"/>
        <div class="main">
            <DataTable class="table" :data="normatives"/>
            <DataTableSideNav
                class="info-panel" 
                :title="'Информация'" 
                :data="labels(studentInfo)" 
                :isContentStaticText="true" 
                :pageType="'student'" 
                :hasDeleteMenu="false" />
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