<template>
  <el-form :inline="true" v-model="formData" class="query">
    <el-form-item label="月份">
      <el-select v-model="formData.month" placeholder="请选择月份" class="query-item">
        <el-option v-for="(month, index) in months" :label="month" :value="index" :key="index"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型">
      <el-select v-model="formData.type" placeholder="请选择类型" class="query-item">
        <el-option label="全部" :value="2"></el-option>
        <el-option label="收入" :value="1"></el-option>
        <el-option label="支出" :value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分类">
      <el-select v-model="formData.cate" placeholder="请选择分类" class="query-item">
        <el-option label="全部" :value="''"></el-option>
        <el-option v-for="cate in cates" :label="cate.name" :value="cate.id" :key="cate.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onQuery">查询</el-button>
      <el-button type="success" @click="drawerVisible = true">添加</el-button>
    </el-form-item>
  </el-form>
  <el-drawer
    v-model="drawerVisible"
    title="添加账单"
    direction="rtl"
    size="80%"
    custom-class="drawer"
    @closed="resetForm(addFormRef)"
  >
    <el-form ref="addFormRef" :model="newBillData" :rules="billRules">
      <el-form-item label="时间" prop="time">
        <el-date-picker
          v-model="newBillData.time"
          type="date"
          placeholder="请选择时间"
          class="form-item"
          :disabled-date="(d) => d.getTime() > Date.now()"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="分类" prop="cate">
        <el-select v-model="newBillData.cate" placeholder="请选择分类" class="form-item">
          <el-option v-for="cate in cates" :label="cate.name" :value="cate.id" :key="cate.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number v-model="newBillData.amount" :min="1" class="form-item"></el-input-number>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="onAdd(addFormRef)">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, defineProps, defineEmits, watch, ref } from 'vue'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import { db } from '../db.js';

interface Cate {
  id: string
  type: number
  name: string
}

const { cates } = defineProps<{
  cates: Cate[]
}>()

const emit = defineEmits<{
  (e: 'query', formData: object): void
}>()

const months = ['全部', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

const formData = reactive({
  month: 0,
  type: 2,
  cate: '',
})

const newBillData = reactive({
  time: null,
  cate: '',
  amount: 1,
})

const billRules = {
  time: [
    {
      required: true,
      message: '请输入时间',
      trigger: 'change',
    },
  ],
  cate: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'change',
    },
  ],
  amount: [
    {
      required: true,
      message: '金额必须大于0',
      trigger: 'change',
    },
  ]
}

const drawerVisible = ref(false)

const addFormRef = ref<InstanceType<typeof ElForm>>()

const onQuery = () => {
  emit('query', formData)
}

const onAdd = (addFormRef) => {
  if (!addFormRef) return
  addFormRef.validate(async (valid) => {
    if (!valid) {
      return false
    } 

    try {
      const {time, cate, amount} = newBillData
      const {type} = await db.categories.get({id: newBillData.cate})
      await db.bills.add({
        type,
        time: time.getTime(),
        category: cate,
        amount,
      })
      drawerVisible.value = false
      emit('query', formData)
    } catch(e) {
      ElMessage({
        message: e,
        type: 'error',
      })
    }
  })
}

const resetForm = (addFormRef) => {
  addFormRef.resetFields()
}

watch(
  () => ({...formData}),
  () => {
    setTimeout(() => {
      emit('query', formData)
    })
  }
)  
</script>

<style>
.query {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.drawer {
  max-width: 600px;
}

.query-item {
  width: 120px;
}

.form-item {
  width: 220px;
}

.form-item .el-input__prefix-inner, .form-item .el-input__suffix-inner {
  align-items: center;
}

@media screen and (max-width: 500px) {
  .query {
    display: block;
  }
}
</style>