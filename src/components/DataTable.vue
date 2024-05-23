<script setup lang="ts">
import {ref} from 'vue'
import type { VDataTable } from 'vuetify/components'

const props = defineProps<{
  data: Item[];
}>()
interface Item {
  id: number;
  number:number;
  normative: string;
  result?: number;
  rate?: number;
}
function meanValue(array: any){
    if (array.length === 0) return 0;
    return (array.reduce((acc: number, c: number) => acc + c, 0) / array.length).toFixed(2);
}
const totalRate = ref(meanValue((props.data.map((item)=>item.rate))))

const headers: VDataTable['$props']['headers'] = [
  { title: '№', value: 'number', width: 100 },
  { title: 'норматив', value: 'normative', sortable: true },
  { title: 'результат', value: 'result', sortable: true, width: 120 },
  { title: 'оценка', value: 'rate', sortable: true, width:  120},
]



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
            class="table"
            :mobile="true"> 
            <template #item.result="{item}">
                <v-text-field v-model="item.result" class="changeable-fields" />
            </template>
            <template #body.append>
                <tr class="total-rate">
                    <td></td>
                    <td>Итого</td>
                    <td></td>
                    <td>{{totalRate}}</td>
                </tr>
            </template>
            <template #footer.prepend>
                <v-btn class="button" color="primary">Сохранить</v-btn>
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