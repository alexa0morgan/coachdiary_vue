<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import {ref} from 'vue'
import TopPanel from '@/components/TopPanel.vue'
import LevelPanel from '@/components/LevelPanel.vue'
import DataTable from '@/components/DataTable.vue'

const normatives = [
    { id: 0, name: 'бег 100м', result: '15', rate: 5 },
    { id: 1, name: 'метание мяча', result: '60', rate: 5},
    { id: 2, name: 'прыжок в длину', result: '1.20', rate: 4 },
]
const studentInfo = {
    id: 0,
    name: 'Афанасьева Марина Владимировна',
    dateBirth: new Date(2018, 3, 3),
    class: '11в',
    sex: 'девочка'
}
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
</script>

<template>
    <AppBar mobile-title="Ученик"/>
    <v-main>
        <TopPanel>
            <div>{{ studentInfo.name }}</div>
        </TopPanel>
        <LevelPanel :classNumber="getClassNumber(studentInfo.class)" class="level-panel"/>
        <div class="main">
            <DataTable :data="normatives"/>
            <div class="info-panel">
                <div class="info-title">информация</div>
                <v-list class="list">
                    <v-list-item class="list-item">
                        <v-list-item-title>день рождения:</v-list-item-title>
                        <div>{{dateBirth(studentInfo.dateBirth)}}</div>
                    </v-list-item>
                    <v-list-item class="list-item">
                        <v-list-item-title>класс:</v-list-item-title>   
                        <div>{{studentInfo.class}}</div>
                    </v-list-item>
                    <v-list-item class="list-item">
                        <v-list-item-title>пол:</v-list-item-title>
                        <div>{{studentInfo.sex}}</div>
                    </v-list-item>
                </v-list>
                <div class="buttons">
                    <v-btn text="Изменить" variant="outlined" color="primary-darken-1" size="small"
                         class="button action-button" />
                    <v-btn text="Удалить" variant="outlined" color="error" size="small" class="button action-button"/>
                </div>
            </div>
        </div>

    </v-main>

</template>

<style scoped>
.main{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 10px;
    max-width: 1200px;
    margin: 50px auto 0;
}
.info-panel{
    background-color: rgb(var(--v-theme-background));
    border: 1px solid rgb(var(--v-theme-primary));
    border-radius: var(--v-border-radius);
    padding: 10px;
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
</style>