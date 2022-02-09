<template>
  <el-table :data="tableData" stripe @sort-change="handleSort">
    <el-table-column align="center" prop="typeStr" label="类型" />
    <el-table-column align="center" prop="timeStr" label="时间" min-width="110" />
    <el-table-column align="center" prop="categoryStr" label="分类" />
    <el-table-column align="center" prop="amount" label="金额" sortable="custom" />
  </el-table>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

interface Bill {
  typeStr: string
  timeStr: string
  categoryStr: string
  amount: number
}

const { tableData } = defineProps<{
  tableData: Bill[]
}>()

const emit = defineEmits<{
  (e: 'sort', conf: object): void
}>()

const handleSort = async (conf) => {
  emit('sort', conf)
}
</script>
