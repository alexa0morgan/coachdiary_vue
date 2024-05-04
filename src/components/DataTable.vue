<script setup lang="ts">
import {ref} from 'vue'

const props = defineProps<{
  data: Array<Record<string, any>>;
}>()
function meanValue(array: any){
    if (array.length === 0) return 0;
    return (array.reduce((acc: number, c: number) => acc + c, 0) / array.length).toFixed(2);
}
const totalRate = ref(meanValue((props.data.map((item)=>item.rate))))

</script>
<template>
    <table class="table">
        <thead>
            <tr>
                <td>№</td>
                <td>Норматив</td>
                <td>Результат</td>
                <td>Оценка</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="normative in data" :key="normative.id">
                <td>{{ normative.id+1 }}</td>
                <td>{{ normative.name }}</td>
                <td>{{ normative.result}}</td>
                <td>{{ normative.rate }}</td>
            </tr>
            <slot />
            <tr class="total-rate">
                <td></td>
                <td>Итого</td>
                <td></td>
                <td>{{totalRate}}</td>
            </tr>
        </tbody>
    </table>
</template>
<style scoped>
.table {
    width: 100%;
    border-spacing: 0;
    border-radius: var(--v-border-radius);
    overflow: hidden;
    font-weight: bold;

    thead tr {
        text-transform: uppercase;
        font-weight: bold;
        background: rgb(var(--v-theme-surface));

        td {
            padding: 12px 40px;
        }
    }
    tbody {
        color: rgb(var(--v-theme-primary));

        td {
            padding: 4px 40px;
            text-transform: capitalize;
        }

        tr:nth-child(even) {
            background: rgb(var(--v-theme-surface));
        }
    }
}
.total-rate{
    background-color: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-secondary)) !important;
}
</style>