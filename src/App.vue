<template>
  <div class="container">
    <BillForm 
      :cates="state.categories" 
      @query="handleQuery" />
    <div class="stat" v-if="state.loaded">
      <span class="stat-item">收入: {{state.income}}</span>
      <el-divider direction="vertical"></el-divider>
      <span class="stat-item">支出: {{state.expend}}</span>
    </div>
    <el-divider></el-divider>
    <BillList 
      :tableData="formattedBills"
      @sort="handleSort" />
    <div class="pager">
      <el-pagination
        :hide-on-single-page="true"
        :page-size="pageSize"
        :total="state.count"
        layout="prev, pager, next"
        @current-change="paging"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { onMounted } from '@vue/runtime-core'

import axios from 'axios'
import dayjs from 'dayjs';

import { db } from './db.js';
import BillList from './components/BillList.vue'
import BillForm from './components/BillForm.vue'

const pageSize = 15

const state = reactive({
  count: 0,
  page: 1,
  categories: [],
  bills: [], 
  month: 0,
  type: 2,
  cate: '',
  sorter: 'time',
  order: null,
  income: 0,
  expend: 0,
  loaded: false,
})

const formattedBills = computed(() => {
  return state.bills.map(bill => {
    const curCate = state.categories.find(cate => {
      return cate.id === bill.category
    })

    return {
      typeStr: bill.type === 1 ? '收入' : '支出',
      timeStr: dayjs(bill.time).format('YYYY-MM-DD'),
      categoryStr: !curCate ? '未知' : curCate.name,
      amount: bill.amount,
      id: bill.id
    }
  })
})

const sumAttrOfArray = (arr) => {
  if (arr.length === 0) return 0
  return arr.reduce((acr, cur) => {
    return acr + cur
  });
}

const handleQuery = async ({month, type, cate}) => {
  state.month = month
  state.type = type
  state.cate = cate

  const allBill = await db.bills
    .filter(bill => {
      return (!state.month || new Date(bill.time).getMonth() === state.month - 1)
        && (state.type === 2 || bill.type === state.type)
        && (!state.cate || bill.category === state.cate)
    })
    .toArray()

  state.income = sumAttrOfArray(allBill
    .filter(bill => bill.type === 1)
    .map(bill => bill.amount))
  state.expend = sumAttrOfArray(allBill
    .filter(bill => bill.type === 0)
    .map(bill => bill.amount))

  paging(1)
}

const handleSort = async ({prop, order}) => {
  state.sorter = prop
  state.order = order
  paging()
}

const paging = async (pageNumber) => {
  let queryPromise = db.bills.orderBy(state.sorter);

  if (state.sorter === 'time' || state.order === 'descending') {
    queryPromise = queryPromise.reverse()
  }

  const meetedBillsPromise = queryPromise.filter(bill => {
    return (!state.month || new Date(bill.time).getMonth() === state.month - 1) 
      && (state.type === 2 || bill.type === state.type)
      && (!state.cate || bill.category === state.cate)
  })

  if (pageNumber) {
    state.page = pageNumber
  }

  state.count = await meetedBillsPromise.count()
  state.bills = await meetedBillsPromise
    .offset((state.page - 1) * pageSize)
    .limit(pageSize)
    .toArray()

  state.categories = await db.categories
    .orderBy('id')
    .toArray()
}

onMounted(async () => {
  state.count = await db.bills.count()

  if (state.count === 0) {
    try {
      const {data: {bills, categories}} = await axios.get('/api/raw')
      await db.bills.bulkAdd(bills)
      await db.categories.bulkAdd(categories)
    } catch (err) {
      console.error(err)
    }
  }

  await handleQuery({
    month: 0,
    type: 2,
    cate: '',
  })

  state.loaded = true;
}) 
</script>

<style>
.container {
  max-width: 750px;
  margin: 20px auto;
}
.stat {
  display: flex;
  justify-content: end;
  color: rgb(96, 98, 102);
  font-size: 14px;
  line-height: 1;
}
.stat-item {
  padding: 0 30px;
}
.pager {
  padding-top: 20px;
  text-align: right;
}
</style>
