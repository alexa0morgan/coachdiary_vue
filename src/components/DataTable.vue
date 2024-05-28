<script setup lang="ts">
import type { VDataTable } from 'vuetify/components'
import {computed, onMounted, ref} from 'vue'
import type { StudentStandardRequest } from '@/types/types'

const emit = defineEmits<{
    dataChanged: [];
}>()
const {data} = defineProps<{
    data: Item[];
}>()
const changedData = defineModel<StudentStandardRequest>()

function removeDuplicatesAndKeepLast(arr: Item[]): Item[] {
    const uniqueObjects: Item[] = [];
    const seenIds: Set<number> = new Set();

    for (let i = arr.length - 1; i >= 0; i--) {
        const obj = arr[i];
        if (!seenIds.has(obj.id)) {
            uniqueObjects.push(obj);
            seenIds.add(obj.id);
        }
    }
    return uniqueObjects.reverse(); 
}

interface Item {
    student_id: number,
    id: number;
    has_numeric_value: boolean,
    normative: string;
    result: number;
    rate: number;
    level_number: number;
}
const totalRate = computed(()=>{
    const array = data.map((item)=>item.rate)
    return array ? +((array.reduce((acc: any, c: any) => acc + c, 0) / array.length).toFixed(2)) : 0;
})

const headers = [
    { title: 'норматив', value: 'normative', sortable: true },
    { title: 'результат', value: 'result', sortable: true, width: 120},
    { title: 'оценка', value: 'rate', sortable: true, width: 120},
] 

const tableData = ref<Item[]>([]); 

function onRateChange(item: Item) {
    tableData.value.push(item)
}

function saveData(): void{
    changedData.value = removeDuplicatesAndKeepLast(tableData.value).map((item) => {
        return {
            student_id: item.student_id,
            standard_id: item.id,
            value: item.has_numeric_value ? +item.result : +item.rate,
            level_number: item.level_number
        }
    }).filter((item) => item !== undefined) as StudentStandardRequest
    emit('dataChanged');
}
function getMarkColor(mark?: number): string {
  switch (mark) {
    case 2:
      return 'mark-bad'
    case 3:
      return 'mark-okay'
    case 4:
      return 'mark-good'
    case 5:
      return 'mark-great'
    default:
      return ''
  }
}
</script>
<template>
    <v-data-table
        :headers="headers"
        :items="data"
        :sort-by="[{ key: 'number', order: 'asc' }]"
        :fixed-header="true"
        :itemsPerPageOptions="[10, 20, { title: 'Все', value: -1 }]"
        :items-per-page-text="'cтрок на странице'"
        :show-current-page="true"
        item-key="id" 
        no-data-text="нет данных о нормативах на данном уровне"
        class="table"
        :mobile="true"> 
        <template #item.result ="{item}">
            <v-text-field  
                v-if="item.has_numeric_value" 
                v-model="item.result" 
                class="changeable-fields" 
                @update:modelValue="onRateChange(item)"/>
            <span v-else> нет</span>
        </template>
        <template  #item.rate ="{item}" >
            <span :class="getMarkColor(item.rate ?? 0)" class="mark" v-if="item.has_numeric_value"> {{ item.rate }}</span>
            <v-text-field 
                v-else 
                v-model="item.rate" 
                :class="getMarkColor(item.rate?? 0)" class="mark changeable-fields"
                @update:modelValue="onRateChange(item)"/>
        </template>
        <template #body.append>
            <tr class="total-rate">
                <td>Итого</td>
                <td></td>
                <td>{{ totalRate }}</td>
            </tr>
        </template>
        <template #footer.prepend>
            <v-btn @click="saveData" class="button" color="primary">Сохранить</v-btn>
            <div class="space" />
        </template>  
    </v-data-table>

</template>
<style scoped>
.table {
    width: 100%;
    border-spacing: 0;
    border-radius: var(--v-border-radius);
    overflow: hidden;
    font-weight: bold;
    text-transform: capitalize;
    color: rgb(var(--v-theme-primary));
}
.changeable-fields{
    color: rgb(var(--v-theme-primary));
    font-weight: bold;
}
.total-rate{
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-secondary));
    text-transform: uppercase;
    position: sticky;
    bottom: 0px;
}
.space{
    flex:1
}
.table:deep(.v-table__wrapper) {
    border: 1px solid rgb(var(--v-theme-surface));
    border-radius: 0px;
}
.table:deep(.v-data-table-header__content) {
    color: black;
    text-transform: uppercase;
    font-weight: bold;
}
.table:deep(.v-data-table-footer) {
    color: black;
    text-transform: lowercase;
    font-weight: 400;
}
.table:deep(.v-data-table__tr):nth-child(odd) {
    background: rgb(var(--v-theme-background));
}
.mark {
  font-weight: bold;
  text-align: center;

}

.mark-bad {
  color: red;
}

.mark-okay {
  color: #ff8800;
}

.mark-good {
  color: #0ecc00;
}

.mark-great {
  color: green;
}

@media(max-width: 1280px){
    .table{
        font-weight: 400;
        font-size: 10px;
    }
    .table:deep(.v-data-table__td){
        height: 40px !important;
    }
    .table:deep(td){
        height: 40px !important;
    }
    .table:deep(tr.v-data-table__tr){
        height: 40px !important;
    }
    .changeable-fields{
        font-weight: 400;
    }
    .changeable-fields:deep(.v-field__input){
        font-size: 10px;
    }
    .button:deep(.v-btn__content){
        font-size: 10px !important;
    }
}
</style>